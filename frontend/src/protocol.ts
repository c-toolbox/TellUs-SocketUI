import { UiButtonConfig, UiButtonEvent } from "./components/Button";
import { UiDropdownConfig, UiDropdownEvent } from "./components/Dropdown";
import { UiGridConfig } from "./components/Grid";
import { UiHrConfig } from "./components/Hr";
import { UiRatioSliderConfig, UiRatioSliderEvent } from "./components/RatioSlider";
import { UiSliderConfig, UiSliderEvent } from "./components/Slider";
import { UiSwitchConfig, UiSwitchEvent } from "./components/Switch";
import { UiTextConfig } from "./components/Text";

export type UiElement =
	| UiButtonConfig
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
	| UiDropdownEvent
	| UiRatioSliderEvent
	| UiSliderEvent
	| UiSwitchEvent;

export type UiEvent = UiConfigEvent | UiRequestEvent | UiUpdateEvent;
