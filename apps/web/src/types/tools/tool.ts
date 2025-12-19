import { ToolType } from "../shapes";

export interface ActiveTool {
  type: ToolType;
  isLocked: boolean;
}
