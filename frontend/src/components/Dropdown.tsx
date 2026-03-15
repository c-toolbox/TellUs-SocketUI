import { useEffect, useState } from "react";

export interface UiDropdownConfig {
	type: "dropdown";
	id: string;
	hint_title?: string;
	hint_text?: string;
	options: string[];
	value: string;
	color?: string;
}

export interface UiDropdownEvent {
	type: "dropdown";
	id: string;
	value: string;
}

export function UiDropdown(
	props: UiDropdownConfig & { onChange: (value: string) => void },
) {
	const [select, setSelect] = useState<string>(props.value);

	useEffect(() => {
		setSelect(props.value);
	}, [props.value]);

	return (
		<div className="element">
			<div className="flex flex-col text-left">
				<b>{props.hint_title}</b>
				<small>{props.hint_text}</small>
			</div>
			<select
				className="bg-blue-600 border border-zinc-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition cursor-pointer"
				style={{
					backgroundColor: props.color ?? "",
				}}
				value={select}
				onChange={(e) => {
					const newValue = e.target.value;
					setSelect(newValue);
					props.onChange(newValue);
				}}
			>
				{props.options.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
		</div>
	);
}
