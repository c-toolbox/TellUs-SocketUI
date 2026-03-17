import { useEffect, useRef, useState } from "react";

import { UiEvent, UiConfigEvent, UiElement } from "./protocol";
import { UiButton } from "./components/Button";
import { UiDropdown } from "./components/Dropdown";
import { UiHr } from "./components/Hr";
import { UiRatioSlider } from "./components/RatioSlider";
import { UiSlider } from "./components/Slider";
import { UiSwitch } from "./components/Switch";
import { UiText } from "./components/Text";
import { UiGrid } from "./components/Grid";

type ConnectionStatus = "OFFLINE" | "CONNECTING" | "BLANK" | "ONLINE";

export default function App() {
	const [config, setConfig] = useState<UiConfigEvent>({
		type: "config",
		title: "Blank",
		elements: [],
	});
	const [connectionStatus, setConnectionStatus] =
		useState<ConnectionStatus>("OFFLINE");

	const socket = useRef<WebSocket | null>(null);

	function connectToServer() {
		const url = `ws://${location.hostname}:7000/ws`;

		socket.current = new WebSocket(url);
		setConnectionStatus("CONNECTING");

		socket.current.onopen = () => {
			setConnectionStatus("BLANK");
			sendData({ type: "request" });
		};

		socket.current.onclose = () => {
			socket.current = null;
			setConnectionStatus("OFFLINE");
		};

		socket.current.onerror = (event: Event) => {
			setConnectionStatus("OFFLINE");
			console.error(event);
		};

		socket.current.onmessage = (event: MessageEvent) => {
			const data: UiEvent = JSON.parse(event.data);
			console.log(data);

			switch (data.type) {
				case "config":
					setConnectionStatus("ONLINE");
					setConfig(data);
					break;
				case "dropdown":
				case "slider":
				case "switch":
					console.log("Received:", data);
			}
		};
	}

	useEffect(() => {
		if (socket.current === null) {
			connectToServer();
		}
	}, [socket]);

	function sendData(data: UiEvent) {
		console.log("Sending", data);
		if (socket.current) {
			socket.current.send(JSON.stringify(data));
		}
	}

	switch (connectionStatus) {
		case "CONNECTING":
			return (
				<div className="panel">
					<UiText
						type="text"
						id="connecting"
						hint_title="Connecting to SocketUi..."
					/>
				</div>
			);

		case "OFFLINE":
			return (
				<>
					<h1>Offline</h1>

					<div className="panel">
						<UiButton
							type="button"
							id="reconnect"
							text="Reconnect"
							hint_title="Connection lost"
							hint_text="Click to attempt to reconnect to the server."
							onClick={connectToServer}
						/>
					</div>
				</>
			);

		case "BLANK":
			return (
				<>
					<h1>Waiting for application</h1>

					<div className="panel">
						<UiText
							type="text"
							id="quiet"
							hint_title="It's quiet."
							hint_text="No application is currently connected to SocketUi."
						/>
						<UiButton
							type="button"
							id="refresh"
							text="Refresh"
							hint_text="Send a signal to Tellus."
							onClick={() => sendData({ type: "request" })}
						/>
					</div>
				</>
			);

		case "ONLINE":
			return (
				<>
					<h1>{config.title}</h1>
					<div className="panel">
						{config.elements.map((element: UiElement) =>
							getComponent(element, sendData),
						)}
					</div>
				</>
			);
	}
}

function getComponent(element: UiElement, sendData: (data: UiEvent) => void) {
	switch (element.type) {
		case "button":
			return (
				<UiButton
					key={element.id}
					{...element}
					onClick={() => sendData({ type: "button", id: element.id })}
				/>
			);

		case "dropdown":
			return (
				<UiDropdown
					key={element.id}
					{...element}
					onChange={(value) =>
						sendData({ type: "dropdown", id: element.id, value })
					}
				/>
			);

		case "hr":
			return <UiHr key={element.id} {...element} />;

		case "ratio_slider":
			return (
				<UiRatioSlider
					key={element.id}
					{...element}
					onChange={(values: number[]) =>
						sendData({
							type: "ratio_slider",
							id: element.id,
							values,
						})
					}
				/>
			);

		case "slider":
			return (
				<UiSlider
					key={element.id}
					{...element}
					onChange={(value) =>
						sendData({ type: "slider", id: element.id, value })
					}
				/>
			);

		case "switch":
			return (
				<UiSwitch
					key={element.id}
					{...element}
					onChange={(value) =>
						sendData({ type: "switch", id: element.id, value })
					}
				/>
			);

		case "text":
			return <UiText key={element.id} {...element} />;

		case "grid":
			return (
				<UiGrid key={element.id} {...element}>
					{element.elements.map((element: UiElement) => (
						<div
							key={element.id}
							className="border border-zinc-700 rounded-lg p-3"
						>
							{getComponent(element, sendData)}
						</div>
					))}
				</UiGrid>
			);
	}
}
