import { ReactNode } from "react";
import { UiElement } from "../protocol";

export interface UiGridConfig {
	type: "grid";
	columns: number;
	elements: UiElement[];
}

export function UiGrid(props: UiGridConfig & { children?: ReactNode }) {
	return (
		<div className="element">
			<div
				className="w-full grid gap-2"
				style={{
					gridTemplateColumns: `repeat(auto-fit, minmax(max(200px, ${100 / props.columns}% - 8px), 1fr))`,
				}}
			>
				{props.children}
			</div>
		</div>
	);
}
