export interface UiTextConfig {
	type: "text";
	hint_title?: string;
	hint_text?: string;
}

export function UiText(props: UiTextConfig) {
	return (
		<div className="flex flex-col text-left whitespace-pre-wrap wrap-break-word">
			<b>{props.hint_title}</b>
			<small>{props.hint_text}</small>
		</div>
	);
}
