import { Text } from "@/types/shapes";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

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
export const measureTextWidth = (text: string, fontSize: number, fontFamily: string): number => {
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

interface NewText {
  shapeProps: ShapeProps;
}

interface OldText {
  textProps: Text;
  shapeProps: ShapeProps;
}

interface ExtractTextPropsType {
  newText?: NewText;
  oldText?: OldText;
}

export interface ShapeProps {
  id: string | null;
  x: number;
  y: number;
  height: number;
  width: number;
  type: "whiteboard" | "shape";
  method: "new" | "update";
}

const extractShapeProps = (text: Konva.Node | null): ExtractTextPropsType | null => {
  if (text === null) return null;

  const textGroup = text.getParent()!;
  const shapeProps = textGroup?.findOne(".shape");
  const whiteBoard = textGroup?.getParent();

  if (!(shapeProps || whiteBoard)) return null;

  const textProps = text.attrs;
  textProps["x"] = textGroup.attrs.x;
  textProps["y"] = textGroup.attrs.y;

  return {
    oldText: {
      textProps,
      shapeProps: {
        id: shapeProps?.attrs?._id ?? null,
        x: textGroup.attrs.x,
        y: textGroup.attrs.y,
        height: (shapeProps?.height() ?? whiteBoard?.height()) as number,
        width: (shapeProps?.width() ?? whiteBoard?.width()) as number,
        type: shapeProps ? "shape" : "whiteboard",
        method: "update",
      },
    },
  };
};

/**
 * Extract shape properties from Konva event
 */
export const extractTextShapeProps = (
  e: KonvaEventObject<MouseEvent>,
): ExtractTextPropsType | null => {
  let props: ExtractTextPropsType | null = null;
  const target = e.target;

  if (target.nodeType === "Shape") {
    if (target.className === "Text") {
      props = extractShapeProps(target);
    } else {
      const parent = target.getParent()!;
      const text = parent?.findOne(".text");

      if (text) {
        props = extractShapeProps(text);
      } else {
        props = {
          newText: {
            shapeProps: {
              id: target?.attrs._id,
              x: parent.attrs.x,
              y: parent.attrs.y,
              height: target.height(),
              width: target.width(),
              type: "shape",
              method: "new",
            },
          },
        };
      }
    }
  } else if (target.nodeType === "Stage") {
    props = {
      newText: {
        shapeProps: {
          id: null,
          x: e.evt.clientX,
          y: e.evt.clientY,
          height: e.target.height() - e.evt.clientY,
          width: e.target.width() - e.evt.clientX,
          type: "whiteboard",
          method: "new",
        },
      },
    };
  }

  return props;
};
