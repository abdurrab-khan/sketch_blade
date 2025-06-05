import { IconType } from "react-icons";
import { TbLetterS, TbLetterM, TbLetterL } from "react-icons/tb";
import {
  EdgeStyle,
  FillStyle,
  FontSize,
  StrokeStyle,
  StrokeWidth,
} from "../../../types/shapes";

interface IToolActionProperties {
  strokeColors: string[];
  backgroundColors: string[];
  fillStyles: {
    path: string;
    color: FillStyle;
  }[];
  strokeWidth: {
    path: string;
    width: StrokeWidth;
  }[];
  strokeStyles: {
    path: string;
    style: StrokeStyle;
  }[];
  edgeRounded: {
    path: string;
    style: EdgeStyle;
  }[];
  fontSize: {
    Icon: IconType;
    size: FontSize;
  }[];
}

const BASE_URL = "/assets/icons/";

const ToolActionsProperties: IToolActionProperties = {
  strokeColors: ["#BBE1FA", "#3282B8", "#0F8C79", "#F0F0F0", "#FFD700"],
  backgroundColors: ["#0A1F2C", "#1C3A4B", "#3F4E5B", "#3F5F6B", "#506F7B"],
  fillStyles: [
    {
      path: BASE_URL + "solid.svg",
      color: "SOLID",
    },
    {
      path: BASE_URL + "hachure.svg",
      color: "HACHURE",
    },
    {
      path: BASE_URL + "crosshatch.svg",
      color: "CROSSHATCH",
    },
  ],
  strokeWidth: [
    {
      path: BASE_URL + "solid-line.svg",
      width: "THIN",
    },
    {
      path: BASE_URL + "medium-line.svg",
      width: "MEDIUM",
    },
    {
      path: BASE_URL + "thick-line.svg",
      width: "THICK",
    },
  ],
  strokeStyles: [
    {
      path: BASE_URL + "solid-line.svg",
      style: "SOLID",
    },
    {
      path: BASE_URL + "dashed-line.svg",
      style: "DASHED",
    },
    {
      path: BASE_URL + "dotted-line.svg",
      style: "DOTTED",
    },
  ],
  edgeRounded: [
    {
      path: BASE_URL + "rounded-edge.svg",
      style: "ROUNDED",
    },
    {
      path: BASE_URL + "sharp-edge.svg",
      style: "SHARP",
    },
  ],
  fontSize: [
    {
      Icon: TbLetterS,
      size: "SMALL",
    },
    {
      Icon: TbLetterM,
      size: "MEDIUM",
    },
    {
      Icon: TbLetterL,
      size: "LARGE",
    },
  ],
};

export default ToolActionsProperties;
