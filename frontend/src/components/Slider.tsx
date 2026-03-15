import { useEffect, useState } from "react";

export interface UiSliderConfig {
	type: "slider";
	id: string;
	hint_title?: string;
	hint_text?: string;
	value: number;
	min: number;
	max: number;
	step?: number;
	color?: string;
}

export interface UiSliderEvent {
	type: "slider";
	id: string;
	value: number;
}

export function UiSlider(
	props: UiSliderConfig & { onChange: (value: number) => void },
) {
	const [range, setRange] = useState(props.value);

	useEffect(() => {
		setRange(props.value);
	}, [props.value]);

	return (
		<div className="element block!">
			<div className="flex justify-between items-center gap-4">
				<div className="flex flex-col text-left">
					<b>{props.hint_title}</b>
					<small>{props.hint_text}</small>
				</div>
				<b>{range}</b>
			</div>

			<div className="mt-2 w-full">
				<input
					type="range"
					min={props.min}
					max={props.max}
					step={props.step}
					value={range}
					onChange={(e) => {
						const newValue = parseFloat(e.target.value);
						setRange(newValue);
						props.onChange(newValue);
					}}
					className="w-full accent-blue-600 cursor-ew-resize"
					style={{
						accentColor: props.color ?? "",
					}}
				/>

				{/* Min max labels */}
				<div className="flex justify-between text-sm -mt-1 text-gray-400">
					<span>{props.min}</span>
					<span>{props.max}</span>
				</div>
			</div>
		</div>
	);
}
