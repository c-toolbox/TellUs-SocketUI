import asyncio, json, logging, os, sys, threading, uvicorn, webbrowser
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pystray import Icon, Menu, MenuItem
from PIL import Image


# -------------------------
# Helpers
# -------------------------


def resource_path(relative_path):
    if hasattr(sys, "_MEIPASS"):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.abspath("."), relative_path)


# -------------------------
# Logging (safe for --noconsole)
# -------------------------

logging.basicConfig(
    filename="socketui.log",
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)


# -------------------------
# App setup
# -------------------------

app = FastAPI()

# Serve frontend assets
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
        logging.info("Client connected")

    async def disconnect(self, websocket: WebSocket):
        async with self.lock:
            self.active_connections.discard(websocket)
        logging.info("Client disconnected")

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
# Server runner
# -------------------------


def run_server():
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=7000,
        reload=False,
        workers=1,
        log_config=None,
    )


# -------------------------
# Tray actions
# -------------------------


def open_ui(icon, item):
    webbrowser.open("http://localhost:7000")


def quit_app(icon, item):
    icon.stop()
    os._exit(0)


def create_tray():
    icon_path = resource_path(os.path.join("dist", "icon.ico"))

    # Fallback if icon missing
    if not os.path.exists(icon_path):
        image = Image.new("RGB", (64, 64), color=(0, 0, 0))
    else:
        image = Image.open(icon_path)

    menu = Menu(
        MenuItem("Open", open_ui),
        MenuItem("Quit", quit_app),
    )

    icon = Icon("SocketUI", image, "SocketUI", menu)
    icon.run()


# -------------------------
# Entry point
# -------------------------

if __name__ == "__main__":
    logging.info("Starting SocketUI...")

    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()

    create_tray()
