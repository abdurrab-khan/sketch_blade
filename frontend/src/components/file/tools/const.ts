import { IconType } from "react-icons";
import { TbLetterS, TbLetterM, TbLetterL } from "react-icons/tb";
import {
  EdgeStyle,
  FillStyle,
  FontSize,
  StrokeStyle,
  StrokeWidth,
} from "../../../types/shapes";
import { AllToolBarProperties } from "@/types/tools/tool";

export interface IToolBarPropertiesValue {
  icon: IconType | string;
  value: FillStyle | StrokeWidth | StrokeStyle | EdgeStyle | FontSize;
}

export type ToolActionsPropertiesT = {
  [K in Exclude<keyof AllToolBarProperties, "opacity" | "eraserRadius">]:
    | IToolBarPropertiesValue[]
    | string[];
};

const BASE_URL = "/assets/icons/";

const ToolActionsProperties: ToolActionsPropertiesT = {
  stroke: ["#BBE1FA", "#3282B8", "#0F8C79", "#F0F0F0", "#FFD700"],
  fill: ["#0A1F2C", "#1C3A4B", "#3F4E5B", "#3F5F6B", "#506F7B"],
  fillStyle: [
    {
      icon: BASE_URL + "solid.svg",
      value: "SOLID",
    },
    {
      icon: BASE_URL + "hachure.svg",
      value: "HACHURE",
    },
    {
      icon: BASE_URL + "crosshatch.svg",
      value: "CROSSHATCH",
    },
  ],
  strokeWidth: [
    {
      icon: BASE_URL + "solid-line.svg",
      value: "THIN",
    },
    {
      icon: BASE_URL + "medium-line.svg",
      value: "MEDIUM",
    },
    {
      icon: BASE_URL + "thick-line.svg",
      value: "THICK",
    },
  ],
  strokeStyle: [
    {
      icon: BASE_URL + "solid-line.svg",
      value: "SOLID",
    },
    {
      icon: BASE_URL + "dashed-line.svg",
      value: "DASHED",
    },
    {
      icon: BASE_URL + "dotted-line.svg",
      value: "DOTTED",
    },
  ],
  edgeStyle: [
    {
      icon: BASE_URL + "rounded-edge.svg",
      value: "ROUNDED",
    },
    {
      icon: BASE_URL + "sharp-edge.svg",
      value: "SHARP",
    },
  ],
  fontSize: [
    {
      icon: TbLetterS,
      value: "SMALL",
    },
    {
      icon: TbLetterM,
      value: "MEDIUM",
    },
    {
      icon: TbLetterL,
      value: "LARGE",
    },
  ],
};

export default ToolActionsProperties;
