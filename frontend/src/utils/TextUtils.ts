import { FontFamily } from "@/types/shapes";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

const getMaxText = (text: string[] | null): number => {
  if (text === null) return 1;

  return text.reduce((acc, curr) => {
    if (acc < curr.length) {
      acc = curr.length;
    }
    return acc;
  }, 0);
};

export function getTextAreaHeight(
  text: string[] | null,
  fontSize: number,
): number {
  return text ? text.length * fontSize : fontSize;
}

export function getTextAreaWidth(
  text: string[] | null,
  fontSize: number,
  fontFamily: FontFamily,
): number {
  const textSize = getMaxText(text);

  return textSize * (fontSize * 0.6);
}

export function calTextAreaPosForShape(
  shapeX: number,
  shapeY: number,
  text: string[] | null,
  fontSize: number,
  fontFamily: string,
): { x: number; y: number; height: number; width: number } {
  const textAreaHeight = getTextAreaHeight(text, fontSize);
  const textAreaWidth = getTextAreaWidth(text, fontSize, fontFamily);

  return {
    x: shapeX - textAreaWidth / 2,
    y: shapeY - textAreaHeight / 2,
    height: textAreaHeight * 1.2,
    width: textAreaWidth,
  };
}

interface TextWrapResult {
  wrappedText: string;
  lines: string[];
  requiredHeight: number;
  maxLineWidth: number;
}

/**
 * Creates a canvas context for measuring text
 */
export const createTextMeasurer = (() => {
  let canvas: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = null;

  return () => {
    if (!canvas) {
      canvas = document.createElement("canvas");
      ctx = canvas.getContext("2d");
    }
    return ctx!;
  };
})();

/**
 * Measures the actual width of text using canvas context
 */
export const measureTextWidth = (
  text: string,
  fontSize: number,
  fontFamily: string,
): number => {
  const ctx = createTextMeasurer();
  ctx.font = `${fontSize}px ${fontFamily}`;
  return ctx.measureText(text).width;
};

/**
 * Breaks a long word that exceeds the maximum width
 */
export const breakLongWord = (
  word: string,
  maxWidth: number,
  fontSize: number,
  fontFamily: string,
): string[] => {
  const parts: string[] = [];
  let currentPart = "";

  for (const char of word) {
    const testPart = currentPart + char;
    const testWidth = measureTextWidth(testPart, fontSize, fontFamily);

    if (testWidth <= maxWidth) {
      currentPart = testPart;
    } else {
      if (currentPart) {
        parts.push(currentPart);
        currentPart = char;
      } else {
        // Even single character doesn't fit, force it anyway
        parts.push(char);
        currentPart = "";
      }
    }
  }

  if (currentPart) {
    parts.push(currentPart);
  }

  return parts.length > 0 ? parts : [""];
};

/**
 * Wraps a single line of text based on available width
 */
export const wrapSingleLine = (
  line: string,
  maxWidth: number,
  fontSize: number,
  fontFamily: string,
): string[] => {
  if (!line.trim()) return [""];

  const words = line.split(" ");
  const wrappedLines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const textLine = currentLine ? `${currentLine} ${word}` : word;
    const textWidth = measureTextWidth(textLine, fontSize, fontFamily);

    if (textWidth <= maxWidth) {
      currentLine = textLine;
    } else {
      if (currentLine) {
        wrappedLines.push(currentLine);
        currentLine = word;
      } else {
        // Handle very long words
        const brokenWord = breakLongWord(word, maxWidth, fontSize, fontFamily);
        wrappedLines.push(...brokenWord.slice(0, -1));
        currentLine = brokenWord[brokenWord.length - 1];
      }
    }
  }

  if (currentLine) {
    wrappedLines.push(currentLine);
  }

  return wrappedLines.length > 0 ? wrappedLines : [""];
};

/**
 * Main text wrapping function
 */
export const wrapText = (
  text: string,
  maxWidth: number,
  fontSize: number,
  fontFamily: string,
  lineHeight: number = 1.2,
): TextWrapResult => {
  const lines = text.split("\n");
  const wrappedLines: string[] = [];

  // Process each line
  for (const line of lines) {
    const lineWrapped = wrapSingleLine(line, maxWidth, fontSize, fontFamily);
    wrappedLines.push(...lineWrapped);
  }

  // Calculate actual dimensions
  let maxLineWidth = 0;
  for (const line of wrappedLines) {
    const lineWidth = measureTextWidth(line, fontSize, fontFamily);
    maxLineWidth = Math.max(maxLineWidth, lineWidth);
  }

  const lineHeightPx = fontSize * lineHeight;
  const requiredHeight = wrappedLines.length * lineHeightPx;

  return {
    wrappedText: wrappedLines.join("\n"),
    lines: wrappedLines,
    requiredHeight,
    maxLineWidth,
  };
};

/**
 * Simple character-based wrapping (fallback for paste operations)
 */
export const wrapTextSimple = (
  text: string,
  maxCharsPerLine: number,
  fontSize: number,
  lineHeight: number = 1.2,
): TextWrapResult => {
  const lines = text.split("\n");
  const wrappedLines: string[] = [];

  for (const line of lines) {
    if (line.length <= maxCharsPerLine) {
      wrappedLines.push(line);
    } else {
      const words = line.split(" ");
      let currentLine = "";

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;

        if (testLine.length <= maxCharsPerLine) {
          currentLine = testLine;
        } else {
          if (currentLine) {
            wrappedLines.push(currentLine);
            currentLine = word;
          } else {
            // Break long word
            let remainingWord = word;
            while (remainingWord.length > maxCharsPerLine) {
              wrappedLines.push(remainingWord.substring(0, maxCharsPerLine));
              remainingWord = remainingWord.substring(maxCharsPerLine);
            }
            currentLine = remainingWord;
          }
        }
      }

      if (currentLine) {
        wrappedLines.push(currentLine);
      }
    }
  }

  const lineHeightPx = fontSize * lineHeight;
  const requiredHeight = wrappedLines.length * lineHeightPx;

  return {
    wrappedText: wrappedLines.join("\n"),
    lines: wrappedLines,
    requiredHeight,
    maxLineWidth: maxCharsPerLine * fontSize * 0.6, // Approximate
  };
};

/**
 * Get maximum character length from array of strings
 */
export const getMaxWidth = (arr: string[]): number => {
  return arr.reduce((acc, current) => {
    if (acc < current.length) {
      acc = current.length;
    }
    return acc;
  }, 0);
};

/**
 * Extract shape properties from Konva event
 */
export const extractShapeProps = (
  e: KonvaEventObject<MouseEvent>,
): ExtractShapeProps | null => {
  const target = e.target;
  const parent = target.nodeType !== "Stage" ? target.getParent() : target;

  if (parent?.nodeType === "Group") {
    const shape = (parent as Konva.Group).findOne(".shape");
    if (!shape) return null;

    const x = parent.x();
    const y = parent.y();
    const text = shape?.attrs?.text ?? null;

    return {
      id: shape.attrs?._id,
      x,
      y,
      text,
      height: shape.height(),
      width: shape.width(),
    };
  } else if (parent?.nodeType === "Stage") {
    const x = e.evt.clientX;
    const y = e.evt.clientY;

    return {
      x,
      y,
      text: null,
      height: e.target.height(),
      width: e.target.width(),
    };
  }

  return null;
};

/**
 * Slice strings that exceed maximum width (fallback for paste)
 */
export const sliceStringFixed = (
  textArray: string[],
  indicesToSlice: number[],
  maxWidth: number,
): string[] => {
  const result = [...textArray];
  const sortedIndices = [...indicesToSlice].reverse();

  for (const index of sortedIndices) {
    if (index < 0 || index >= result.length) continue;

    const stringToSlice = result[index];
    const chunks = [];

    for (let i = 0; i < stringToSlice.length; i += maxWidth) {
      chunks.push(stringToSlice.substring(i, i + maxWidth));
    }

    result.splice(index, 1, ...chunks);
  }

  return result;
};

/**
 * Get indices of strings that exceed maximum width
 */
export const getMaxedString = (str: string[], maxWidth: number): number[] => {
  const maxStrings = [];

  for (let i = 0; i < str.length; i++) {
    if (str[i].length > maxWidth) {
      maxStrings.push(i);
    }
  }

  return maxStrings;
};
