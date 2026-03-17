import { useEffect, useRef, useState } from "react";

export interface UiColorConfig {
	type: "color";
	id: string;
	hint_title?: string;
	hint_text?: string;
	value: string;
}

export interface UiColorEvent {
	type: "color";
	id: string;
	value: string;
}

export function UiColor(
	props: UiColorConfig & { onChange: (value: string) => void },
) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [color, setColor] = useState<string>(props.value ?? "#155dfc");

	useEffect(() => {
		setColor(props.value);
	}, [props.value]);

	return (
		<div className="element">
			<div className="flex flex-col text-left">
				<b>{props.hint_title}</b>
				<small>{props.hint_text}</small>
			</div>
			<button
				className="relative px-4 py-2 rounded-xl font-medium transition-all duration-75 active:scale-95 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
				style={{ backgroundColor: color, color: getContrastColor(color) }}
				onClick={() => {
					fileInputRef.current?.click();
				}}
			>
				<span className="inline-block w-[7ch] text-center">
					{color}
				</span>
				<input
					type="color"
					ref={fileInputRef}
					value={color}
					onChange={(e) => setColor(e.target.value)}
					className="invisible absolute left-0 bottom-0 h-0 w-0"
				/>
			</button>
		</div>
	);
}

const getContrastColor = (hexColor: string) => {
	const hex = hexColor.replace("#", "");

	const fullHex =
		hex.length === 3
			? hex
					.split("")
					.map((char) => char + char)
					.join("")
			: hex;

	const r = parseInt(fullHex.substring(0, 2), 16);
	const g = parseInt(fullHex.substring(2, 4), 16);
	const b = parseInt(fullHex.substring(4, 6), 16);

	const yiq = (r * 299 + g * 587 + b * 114) / 1000;
	return yiq >= 128 ? "black" : "white";
};
