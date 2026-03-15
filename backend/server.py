import asyncio, json, os, sys
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn

# -------------------------
# App setup
# -------------------------


def resource_path(relative_path):
    if hasattr(sys, "_MEIPASS"):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.abspath("."), relative_path)


app = FastAPI()

# Serve frontend
app.mount(
    "/assets",
    StaticFiles(directory=resource_path(os.path.join("dist", "assets"))),
    name="assets",
)


@app.get("/")
async def index():
    return FileResponse(resource_path(os.path.join("dist", "index.html")))


# -------------------------
# WebSocket manager
# -------------------------


class ConnectionManager:
    def __init__(self):
        self.active_connections: set[WebSocket] = set()
        self.lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        async with self.lock:
            self.active_connections.add(websocket)
        print("Client connected")

    async def disconnect(self, websocket: WebSocket):
        async with self.lock:
            self.active_connections.discard(websocket)
        print("Client disconnected")

    async def broadcast(self, message: str, sender: WebSocket):
        async with self.lock:
            connections = list(self.active_connections)

        for connection in connections:
            if connection is sender:
                continue

            try:
                await connection.send_text(message)
            except Exception:
                await self.disconnect(connection)


manager = ConnectionManager()

# -------------------------
# WebSocket endpoint
# -------------------------


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)

    try:
        while True:
            message = await websocket.receive_text()

            # Validate JSON
            try:
                data = json.loads(message)
            except json.JSONDecodeError:
                continue

            # Broadcast in same order received
            await manager.broadcast(json.dumps(data), sender=websocket)

    except WebSocketDisconnect:
        await manager.disconnect(websocket)


# -------------------------
# Run server
# -------------------------

if __name__ == "__main__":
    uvicorn.run(
        # "server:app",
        app,
        host="0.0.0.0",
        port=7000,
        reload=False,
        workers=1,  # IMPORTANT for ordering
    )
