import { ToolType } from "@/types/shapes";
import { RefObject } from "react";

/**
 * Utility function to get the custom cursor style based on the active tool and hover state.
 * This function returns a string representing the cursor style.
 * @param activeTool {ToolType} - The current active tool.
 * @param isHovered {boolean} - Indicates if the element is hovered.
 * @returns {string} - A string representing the cursor style.
 */
export function getCustomCursor(activeTool: ToolType, isHovered: boolean): string {
  if (isHovered && activeTool === "cursor") {
    return "cursor-move";
  }

  if (["rectangle", "ellipse", "free hand", "point arrow"].includes(activeTool)) {
    return "cursor-crosshair";
  } else if (activeTool === "text") {
    return "cursor-text";
  } else if (activeTool === "hand") {
    return "cursor-grab";
  } else if (activeTool === "eraser") {
    return "cursor-none";
  } else {
    return "cursor-default";
  }
}

/**
 * Utility function to format a date string into a human-readable format.
 * @param date {string} - The date string to be formatted.
 * @returns {string} - A string representing the time elapsed since the date.
 */
export function getFormattedTime(date: string) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
  } else if (minutes < 60) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else if (hours < 24) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }
}

/**
 * Utility function to check if all provided refs have a current value.
 * If all refs are valid, it returns an array of their current values.
 * otherwise, it returns null.
 * @param args {RefObject<unknown>[]} - An array of RefObject(s) to check.
 * @returns {unknown[] | null} - An array of current values of the RefObjects or null if any RefObject is not defined.
 */
export function checkRefValue(...args: RefObject<unknown>[]): unknown[] | null {
  if (args.some((a) => !a?.current)) return null;

  return args.map((a) => a.current);
}
