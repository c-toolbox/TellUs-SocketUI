import { useEffect, useState } from "react";

export interface UiSwitchConfig {
	type: "switch";
	id: string;
	hint_title?: string;
	hint_text?: string;
	value: boolean;
	color?: string;
}

export interface UiSwitchEvent {
	type: "switch";
	id: string;
	value: boolean;
}

export function UiSwitch(
	props: UiSwitchConfig & { onChange: (value: boolean) => void },
) {
	const [isOn, setIsOn] = useState<boolean>(props.value);

	useEffect(() => {
		setIsOn(props.value);
	}, [props.value]);

	const handleSwitch = () => {
		const newValue = !isOn;
		setIsOn(newValue);
		props.onChange(newValue);
	};

	return (
		<div className="element">
			<div className="flex flex-col text-left break-all">
				<b>{props.hint_title}</b>
				<small>{props.hint_text}</small>
			</div>
			<button
				onClick={handleSwitch}
				className={`relative inline-flex h-7 min-w-14 items-center rounded-full transition-colors cursor-pointer ${
					isOn ? "bg-blue-600" : "bg-gray-400"
				}`}
				style={{
					backgroundColor: props.color ? (isOn ? props.color : "#99a1af") : "",
				}}
			>
				<span
					className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
						isOn ? "translate-x-8" : "translate-x-1"
					}`}
				/>
			</button>
		</div>
	);
}
