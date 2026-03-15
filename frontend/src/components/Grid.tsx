import { ReactNode } from "react";
import { UiElement } from "../protocol";

export interface UiGridConfig {
	type: "grid";
	id: string;
	columns: number;
	elements: UiElement[];
}

export function UiGrid(props: UiGridConfig & { children?: ReactNode }) {
	return (
		<div className="element">
			<div
				className="w-full grid gap-2"
				style={{
					gridTemplateColumns: `repeat(${props.columns ?? 2}, minmax(0, 1fr))`,
				}}
			>
				{props.children}
			</div>
		</div>
	);
}
