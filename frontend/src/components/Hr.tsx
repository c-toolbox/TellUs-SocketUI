export interface UiHrConfig {
	type: "hr";
	hint_title?: string;
}

export function UiHr(props: UiHrConfig) {
	return (
		<div className="element">
			{!!props.hint_title ? (
				<div className="grow flex justify-between items-center gap-4">
					<hr />
					<span>{props.hint_title}</span>
					<hr />
				</div>
			) : (
				<hr />
			)}
		</div>
	);
}
