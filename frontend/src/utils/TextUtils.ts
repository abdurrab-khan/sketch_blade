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
  fontFamily: string,
): number {
  const textSize = getMaxText(text);

  return textSize * (fontSize * 0.6);
}

export function calculateTextAreaProps(
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
    height: textAreaHeight,
    width: textAreaWidth,
  };
}
