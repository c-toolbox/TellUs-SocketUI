export interface UiButtonConfig {
	type: "button";
	id: string;
	text: string;
	hint_title?: string;
	hint_text?: string;
	color?: string;
}

export interface UiButtonEvent {
	type: "button";
	id: string;
}

export function UiButton(props: UiButtonConfig & { onClick?: () => void }) {
	return (
		<div className="element">
			<div className="flex flex-col text-left">
				<b>{props.hint_title}</b>
				<small>{props.hint_text}</small>
			</div>
			<button
				className="px-4 py-2 rounded-xl font-medium transition-all duration-75 active:scale-95 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
				style={{
					backgroundColor: props.color ?? "",
				}}
				onClick={props.onClick}
			>
				{props.text}
			</button>
		</div>
	);
}
