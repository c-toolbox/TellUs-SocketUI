import { useEffect, useRef, useState } from "react";

export interface UiRatioSliderConfig {
	type: "ratio_slider";
	id: string;
	hint_title?: string;
	hint_text?: string;
	values: {
		name: string;
		value: number;
		color: string;
	}[];
}

export interface UiRatioSliderEvent {
	type: "ratio_slider";
	id: string;
	values: number[];
}

const MIN = 1;

export function UiRatioSlider(
	props: UiRatioSliderConfig & { onChange: (values: number[]) => void },
) {
	const sliderRef = useRef<HTMLDivElement>(null);

	const total = props.values.reduce((sum, val) => sum + val.value, 0);

	// convert initial values -> handles
	const initialHandles = props.values
		.slice(0, -1)
		.reduce<number[]>((acc, v, i) => {
			acc.push((acc[i - 1] ?? 0) + v.value);
			return acc;
		}, []);

	const [handles, setHandles] = useState<number[]>(initialHandles);

	useEffect(() => {
		const newHandles = props.values
			.slice(0, -1)
			.reduce<number[]>((acc, v, i) => {
				acc.push((acc[i - 1] ?? 0) + v.value);
				return acc;
			}, []);

		setHandles(newHandles);
	}, [props.values]);

	// derive segments
	const segments =
		props.values.length === 0
			? []
			: props.values.length === 1
				? [total]
				: [
						handles[0],
						...handles.slice(1).map((h, i) => h - handles[i]),
						total - handles[handles.length - 1],
					];

	const startDrag = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();

		const move = (ev: MouseEvent) => {
			if (!sliderRef.current) return;

			const rect = sliderRef.current.getBoundingClientRect();
			const percent = (ev.clientX - rect.left) / rect.width;

			let pos = Math.round(percent * total);

			setHandles((prev) => {
				const next = [...prev];

				next[index] = pos;

				// Push right
				for (let i = index + 1; i < next.length; i++) {
					const minPos = next[i - 1] + MIN;
					if (next[i] < minPos) {
						next[i] = minPos;
					}
				}

				// Push left
				for (let i = index - 1; i >= 0; i--) {
					const maxPos = next[i + 1] - MIN;
					if (next[i] > maxPos) {
						next[i] = maxPos;
					}
				}

				// Check boundaries
				if (next[0] < MIN) return prev;
				if (next[next.length - 1] > total - MIN) return prev;

				// Skip if unchanged
				if (next.every((v, i) => v === prev[i])) return prev;

				const newSegments = [
					next[0],
					...next.slice(1).map((h, i) => h - next[i]),
					total - next[next.length - 1],
				];

				props.onChange(newSegments);

				return next;
			});
		};

		const stop = () => {
			window.removeEventListener("mousemove", move);
			window.removeEventListener("mouseup", stop);
		};

		window.addEventListener("mousemove", move);
		window.addEventListener("mouseup", stop);
	};

	return (
		<div className="element block!">
			<div className="flex justify-between items-center gap-4">
				<div className="flex flex-col text-left">
					<b>{props.hint_title}</b>
					<small>{props.hint_text}</small>
				</div>
			</div>

			<div ref={sliderRef} className="mt-2 relative flex h-8 rounded">
				{segments.map((seg, i) => (
					<div
						key={i}
						style={{
							width: `${(seg / total) * 100}%`,
							backgroundColor: props.values[i]?.color ?? "",
						}}
					/>
				))}

				{handles.map((pos, i) => (
					<div
						key={i}
						onMouseDown={(e) => startDrag(i, e)}
						className="absolute top-0 w-4 h-8 bg-white border border-gray-400 rounded cursor-ew-resize"
						style={{ left: `calc(${(pos / total) * 100}% - 8px)` }}
					/>
				))}
			</div>

			<div className="flex justify-between mt-4 text-sm font-medium">
				{segments.map((v, i) => (
					<div key={i} className="flex-1 text-center">
						<div
							className="w-4 h-4 mx-auto mb-1 rounded"
							style={{ backgroundColor: props.values[i]?.color }}
						/>
						{props.values[i]?.name} {v}
					</div>
				))}
			</div>
		</div>
	);
}
