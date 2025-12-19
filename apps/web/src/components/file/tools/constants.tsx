import React from "react";
import { FaHand } from "react-icons/fa6";
import { GrCursor } from "react-icons/gr";
import { GoCircle } from "react-icons/go";
import { PiRectangle } from "react-icons/pi";
import { FaEraser, FaPencilAlt } from "react-icons/fa";
import { RiText } from "react-icons/ri";
import { BsArrow90DegDown } from "react-icons/bs";
import { ToolType } from "@/types/shapes";

const ToolIcons: { [key in ToolType]: React.ReactElement } = {
  hand: <FaHand />,
  cursor: <GrCursor />,
  rectangle: <PiRectangle />,
  ellipse: <GoCircle />,
  "free hand": <FaPencilAlt />,
  text: <RiText />,
  eraser: <FaEraser />,
  "arrow": <BsArrow90DegDown />,
  // upload: <Upload />,
};

export { ToolIcons };
