export interface UiMultiButtonConfig {
	type: "multi_button";
	buttons: {
		id: string;
		text: string;
		color?: string;
	}[];
	hint_title?: string;
	hint_text?: string;
}

export interface UiMultiButtonEvent {
	type: "multi_button";
	id: string;
}

export function UiMultiButton(
	props: UiMultiButtonConfig & {
		onClick?: (id: string, index: number) => void;
	},
) {
	return (
		<div className="element">
			<div className="flex flex-col text-left">
				<b>{props.hint_title}</b>
				<small>{props.hint_text}</small>
			</div>
			<div className="flex gap-2 flex-wrap">
				{props.buttons.map((button, index) => (
					<button
						key={button.id}
						className="px-4 py-2 rounded-xl font-medium transition-all duration-75 active:scale-95 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
						style={{ backgroundColor: button.color ?? "" }}
						onClick={() => props.onClick?.(button.id, index)}
					>
						{button.text}
					</button>
				))}
			</div>
		</div>
	);
}
