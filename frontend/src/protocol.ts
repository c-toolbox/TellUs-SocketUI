import { UiButtonConfig, UiButtonEvent } from "./components/Button";
import { UiMultiButtonConfig } from "./components/MultiButton";
import { UiColorConfig, UiColorEvent } from "./components/Color";
import { UiDropdownConfig, UiDropdownEvent } from "./components/Dropdown";
import { UiGridConfig } from "./components/Grid";
import { UiHrConfig } from "./components/Hr";
import { UiRatioSliderConfig, UiRatioSliderEvent } from "./components/RatioSlider";
import { UiSliderConfig, UiSliderEvent } from "./components/Slider";
import { UiSwitchConfig, UiSwitchEvent } from "./components/Switch";
import { UiTextConfig } from "./components/Text";

export type UiElement =
	| UiButtonConfig
	| UiMultiButtonConfig
	| UiColorConfig
	| UiDropdownConfig
	| UiHrConfig
	| UiRatioSliderConfig
	| UiSliderConfig
	| UiSwitchConfig
	| UiTextConfig
	| UiGridConfig;

export interface UiConfigEvent {
	type: "config";
	title: string;
	elements: UiElement[];
}

export interface UiRequestEvent {
	type: "request";
}

export type UiUpdateEvent =
	| UiButtonEvent
	| UiColorEvent
	| UiDropdownEvent
	| UiRatioSliderEvent
	| UiSliderEvent
	| UiSwitchEvent;

export type UiEvent = UiConfigEvent | UiRequestEvent | UiUpdateEvent;
