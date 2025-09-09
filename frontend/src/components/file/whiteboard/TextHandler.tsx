import Konva from "konva";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useShapeProperties from "@/hooks/useShapeProperties";
import {
  extractTextShapeProps,
  getMaxedString,
  ShapeProps,
  sliceStringFixed,
  wrapText,
  wrapTextSimple,
} from "@/utils/TextUtils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { KonvaEventObject } from "konva/lib/Node";
import {
  changeActiveTool,
  handleSelectedIds,
  removeUpdateToolBarProperties,
  setShapes,
  updateExistingShapes,
} from "@/redux/slices/appSlice";
import { Text, TextStyle, TextSupportedShapes } from "@/types/shapes";
import { getKonvaStyle, isShapeAddable } from "@/utils/ShapeUtils";

interface TextHandlerProps {
  stageRef: React.RefObject<Konva.Stage>;
  trRef: React.RefObject<Konva.Transformer>;
}

interface TextWrapResult {
  wrappedText: string;
  lines: string[];
  requiredHeight: number;
  maxLineWidth: number;
}

const LINE_HEIGHT = 1.2;

// Utility function to get clicked x, y, height, width
const getTextAreaPos = (x: number, y: number, fontSize: number, fontFamily: string) => {
  const height = fontSize * LINE_HEIGHT;
  const width = fontSize * 0.65;

  return {
    x: x - width / 2,
    y: y - height / 2,
    height,
    width,
  };
};

export default function TextHandler({ stageRef, trRef }: TextHandlerProps) {
  const [textProps, setTextProps] = useState<Text | null>(null);

  const shapeProps = useRef<ShapeProps | null>(null);
  const shapeHeightLimit = useRef<number | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const dispatch = useDispatch();
  const activeTool = useSelector((state: RootState) => state.app.activeTool.type);
  const textStyle = useSelector((state: RootState) => state.app.shapeStyles);
  const newTextProps = useShapeProperties() as Text | null;
  // Let's extract all textProps properties
  const { x, y, height, width, text, fontSize, fontFamily, stroke, align, opacity } = useMemo(() => getKonvaStyle(textProps?.styleProperties ?? null), [textProps?.styleProperties])

  // Reset all shape/text props
  const resetTextProps = () => {
    setTextProps(null);
    shapeProps.current = null;
    shapeHeightLimit.current = null;

    // If we are in text tool, simply so to cursor.
    if (activeTool === "text") dispatch(changeActiveTool({ type: "cursor" }));

    // If we are in cursor, simply remove the toolbarProps.
    if (activeTool === "cursor") dispatch(removeUpdateToolBarProperties(null));

    // Let's clean the "selectedShapesId"
    dispatch(handleSelectedIds(null));
  };

  // Update or add new shape after blur.
  const handleOnBlur = async () => {
    if (textProps == null || !isShapeAddable(textProps)) {
      resetTextProps();
      return; // Blur evt happen but there is not text, Simply reset and return it.
    }

    const shapeProperties = shapeProps.current;
    if (shapeProperties != null) {
      if (shapeProperties.type === "whiteboard") {
        if (shapeProperties.method === "new") {
          dispatch(setShapes(textProps));
        } else {
          dispatch(
            updateExistingShapes({
              shapeId: textProps._id,
              shapeValue: textProps,
            }),
          ); // Updating text.
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { styleProperties: { x, y, ...otherTextStyle } } = textProps;

        dispatch(
          updateExistingShapes({
            shapeId: shapeProperties.id as string,
            shapeValue: { text: otherTextStyle } as TextSupportedShapes
          }),
        ); // Updating text inside shape.
      }
    }

    // Handle Adding into the database.
    resetTextProps();
  };

  // Main input handler with improved text wrapping
  const handleInputText = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const shapePos = shapeProps.current;

      // Does not allow any operations if shapePos and textProps is not there.
      if (!(shapePos && textProps)) return;

      // Extracting all text style properties.
      const { fontSize, fontFamily, height, width, x, y } = getKonvaStyle(textProps.styleProperties);

      const inputText = e.target.value;
      const availableWidth = shapePos.width * 0.98 - 15;

      let wrappedResult: TextWrapResult;
      let finalText = inputText;

      // Handle paste operations with fallback method
      if ((e.nativeEvent as InputEvent).inputType === "insertFromPaste") {
        const lines = inputText.split("\n");
        const maxWidthLimit = Math.floor(availableWidth / (fontSize * 0.6));
        const longLineIndices = getMaxedString(lines, maxWidthLimit);

        if (longLineIndices.length > 0) {
          const slicedLines = sliceStringFixed(lines, longLineIndices, maxWidthLimit);
          finalText = slicedLines.join("\n");

          // Create wrap result using simple wrapping
          wrappedResult = wrapTextSimple(finalText, maxWidthLimit, fontSize);
        } else {
          // Use proper text wrapping for paste content
          wrappedResult = wrapText(inputText, availableWidth, fontSize, fontFamily);
          finalText = wrappedResult.wrappedText;
        }
      } else {
        wrappedResult = wrapText(inputText, availableWidth, fontSize, fontFamily);
        finalText = wrappedResult.wrappedText;
      }

      // Calculate required shape height with padding
      const requiredShapeHeight = wrappedResult.requiredHeight + fontSize * 0.5;
      const minHeight = shapeHeightLimit.current || shapePos.height;
      const newShapeHeight = Math.max(minHeight, requiredShapeHeight);

      // Update shape height if needed
      if (shapePos.id && Math.abs(newShapeHeight - shapePos.height) > 1) {
        // Updating shapePos in locally.
        shapeProps.current = {
          ...shapePos,
          height: newShapeHeight,
        };

        // Updating shapePos in globally.
        dispatch(
          updateExistingShapes({
            shapeId: shapePos.id,
            shapeStyle: {
              height: newShapeHeight
            },
          }),
        );
      }

      // Only changes on textArea state whether changes happen on "height" or "width".
      let textStyle: Partial<Text["styleProperties"]> = {};
      if (
        height !== wrappedResult.requiredHeight ||
        width !== wrappedResult.maxLineWidth
      ) {
        const heightDiff = wrappedResult.requiredHeight - height!;
        const widthDiff = wrappedResult.maxLineWidth - width!;

        textStyle = {
          x: x! - widthDiff / 2,
          y: y! - heightDiff / 2,
          height: wrappedResult.requiredHeight,
          width: wrappedResult.maxLineWidth,
        };
      }

      setTextProps((prev: Text | null) => {
        if (prev === null) return null;

        return {
          ...prev,
          text: finalText,
          styleProperties: {
            ...prev.styleProperties,
            ...textStyle
          }
        };
      });
    },
    [dispatch, textProps],
  );

  const handleStageClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (activeTool !== "text" || newTextProps == null) return;

      // Call blur event if clicked on the stage and already textProps is there.
      if (textProps && e.evt.target !== textAreaRef.current) {
        textAreaRef.current?.blur();
        return;
      }

      // Extracting all text style properties.
      const { fontSize = 18, fontFamily = "roboto" } = getKonvaStyle(newTextProps.styleProperties);

      const shapeAndTextProps = extractTextShapeProps(e);
      if (shapeAndTextProps?.oldText) {
        shapeProps.current = shapeAndTextProps.oldText.shapeProps;
        setTextProps(shapeAndTextProps.oldText.textProps);

        // Let's add text id into "selectedShapesId"
        dispatch(handleSelectedIds({ _id: shapeAndTextProps.oldText.textProps._id, purpose: "FOR_EDITING" }));
      } else if (shapeAndTextProps?.newText) {
        if (!newTextProps) return;

        const newShape = shapeAndTextProps.newText.shapeProps;
        shapeProps.current = newShape;

        if (newShape.type !== "whiteboard") {
          shapeHeightLimit.current = newShape.height;
        }

        const textPos = getTextAreaPos(
          newShape.x,
          newShape.y,
          fontSize,
          fontFamily,
        );

        setTextProps({
          ...newTextProps,
          ...textPos,
          _id: newShape.id!,
          styleProperties: {
            ...newTextProps.styleProperties,
            text: "",
          }
        });
      }
    },
    [activeTool, dispatch, newTextProps, textProps],
  );

  const handleStageDblClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (activeTool !== "cursor") return; // Only double click work for "Cursor"

      const shapeAndTextProps = extractTextShapeProps(e);
      if (shapeAndTextProps?.oldText) {
        shapeProps.current = shapeAndTextProps.oldText.shapeProps;
        setTextProps(shapeAndTextProps.oldText.textProps);

        // Let's add text id into "selectedShapesId"
        dispatch(handleSelectedIds({ _id: shapeAndTextProps.oldText.textProps._id, purpose: "FOR_EDITING" }));
      } else if (shapeAndTextProps?.newText) {
        const textProps = newTextProps;

        // Return if there is no text props
        if (textProps == null) return;

        // Extracting all text style properties.
        const { fontSize = 18, fontFamily = "roboto" } = getKonvaStyle(textProps.styleProperties);

        // Updating the global toolBarProperties.
        dispatch(removeUpdateToolBarProperties(newTextProps));

        // Cleaning the tr nodes and removing all shapes from them.
        trRef.current?.nodes([]);
        dispatch(handleSelectedIds(null));

        const shapeProperties = shapeAndTextProps.newText.shapeProps;
        shapeProps.current = shapeProperties;

        if (shapeProperties.type !== "whiteboard") {
          shapeHeightLimit.current = shapeProperties.height;
        }

        const textPos = getTextAreaPos(
          shapeProperties.x,
          shapeProperties.y,
          fontSize,
          fontFamily,
        );

        setTextProps({
          ...textProps,
          ...textPos,
          attachedShape: shapeProperties.id!,
          styleProperties: {
            ...textProps.styleProperties,
            text: "",
          },
        });
      }
    },
    [activeTool, dispatch, newTextProps, trRef],
  );

  // Handle changes on tool bar props
  useEffect(() => {
    if (textStyle == null || !("text" in textStyle)) return;

    setTextProps((prev: Text | null) => {
      if (prev === null) return null;

      // Extracting all text style properties.
      const { fontSize, fontFamily } = getKonvaStyle(textStyle);

      const hasFontSizeChanged = prev.styleProperties.fontSize !== fontSize;
      const hasFontFamilyChanged = prev.styleProperties.fontFamily !== fontFamily;

      let wrappedText: Partial<TextStyle> = {};
      if (hasFontSizeChanged || hasFontFamilyChanged) {
        const availableWidth = shapeProps.current?.width as number;
        const wrappedResult = wrapText(
          prev.styleProperties.text ?? "",
          availableWidth * 0.98 - 15,
          fontSize,
          fontFamily,
        );

        wrappedText = {
          height: wrappedResult.requiredHeight,
          width: wrappedResult.maxLineWidth,
          text: wrappedResult.wrappedText,
        };
      }

      return {
        ...prev,
        styleProperties: {
          ...textStyle,
          ...wrappedText,
        },
      };
    });
  }, [textStyle]);

  useEffect(() => {
    const stage = stageRef?.current;
    if (!stage) return;

    stage.on("dblclick", handleStageDblClick);
    stage.on("click", handleStageClick);

    return () => {
      stage.off("dblclick", handleStageDblClick);
      stage.off("click", handleStageClick);
    };
  }, [stageRef, handleStageClick, handleStageDblClick]);

  // Return nothing if there is not textProps.
  if (textProps == null) return <></>

  return (
    <div
      style={{
        top: y,
        left: x,
        height: height,
        width: width,
      }}
      className={`absolute z-50`}
    >
      <textarea
        wrap="off"
        name="text"
        ref={textAreaRef}
        value={text ?? ""}
        autoFocus
        style={{
          fontSize: `${fontSize}px`,
          fontFamily: fontFamily,
          lineHeight: `${fontSize * 1.2}px`,
          textAlign: align,
          color: stroke as string,
          opacity: opacity,
        }}
        className="m-0 box-content size-full resize-none overflow-hidden border-none bg-transparent outline-none"
        onChange={handleInputText}
        onBlur={handleOnBlur}
        onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            (e.target as HTMLTextAreaElement).blur();
          }
        }}
      />
    </div>
  );
}
