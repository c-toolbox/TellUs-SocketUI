# SocketUI Backend

The SocketUI backend is a WebSocket server built with **FastAPI** and **Uvicorn** that acts as a bridge between the TellUs application and the SocketUI frontend. It is protocol-agnostic and simply facilitates communication between the two clients.

## Architecture

The backend runs two services on the same port (7000):

- **HTTP Server** - Serves the built SocketUI frontend on `http://localhost:7000`
- **WebSocket Server** - Handles WebSocket connections on `ws://localhost:7000/ws`

The TellUs application and SocketUI frontend connect to the same WebSocket endpoint, allowing them to communicate with each other through the server. The backend relays all messages between any connected clients.

## Prerequisites

- Python 3.8 or higher
- FastAPI: `pip install fastapi`
- Uvicorn: `pip install uvicorn`

## Running for development

To run the backend directly for testing:

```bash
python server.py
```

The server will start on `http://localhost:7000/` and `ws://localhost:7000/ws`.
