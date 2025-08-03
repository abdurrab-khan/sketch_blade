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
  x: number,
  y: number,
  text: string[] | null,
  fontSize: number,
  fontFamily: string,
) {
  const textAreaHeight = getTextAreaHeight(text, fontSize);
  const textAreaWidth = getTextAreaWidth(text, fontSize, fontFamily);

  return {
    textAreaHeight,
    textAreaWidth,
    textAreaX: x - textAreaWidth / 2,
    textAreaY: y - textAreaHeight / 2,
  };
}
