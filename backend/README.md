# SocketUI Backend

The SocketUI backend is a WebSocket server built with **FastAPI** and **Uvicorn** that acts as a bridge between the TellUs application and the SocketUI frontend. It is protocol-agnostic and simply facilitates communication between the two clients.

## Architecture

The backend runs two services on the same port (7000):

- **HTTP Server** - Serves the built SocketUI frontend on `http://localhost:7000`
- **WebSocket Server** - Handles WebSocket connections on `ws://localhost:7000/ws`

The TellUs application and SocketUI frontend connect to the same WebSocket endpoint, allowing them to communicate with each other through the server. The backend relays all messages between any connected clients.

## Prerequisites

- Python 3.8 or higher
- Python packages FastAPI and Uvicorn:
    - Install with `python -m pip install fastapi uvicorn`

## How to run locally

Build the frontend and move the dist to backend. This is so the server can host it.

```bash
cd frontend
npm install
npm run build
mv dist ../backend/dist
```

Next, run the backend server.

```bash
cd backend
python server.py
```

The server will start on `http://localhost:7000/` and `ws://localhost:7000/ws`.
