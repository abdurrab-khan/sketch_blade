import Konva from "konva";
import { v4 as uuid } from "uuid";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { KonvaText, Text, TextSupportedShapes } from "@/types/shapes";
import { getKonvaProps, isShapeAddable } from "@/utils/ShapeUtils";

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
  const toolBarProps = useSelector((state: RootState) => state.app.shapeStyles);
  const newShapeProps = useShapeProperties() as Text | null;

  // Reset all shape/text props
  const resetTextProps = () => {
    setTextProps(null);
    shapeProps.current = null;
    shapeHeightLimit.current = null;

    // If we are in text tool, simply so to cursor.
    if (activeTool === "text") dispatch(changeActiveTool({ type: "cursor" }));

    // If we are in cursor, simply remove the toolbarProps.
    if (activeTool === "cursor") dispatch(removeUpdateToolBarProperties(null));
  };

  // Update or add new shape after blur.
  const handleOnBlur = async () => {
    if (textProps == null || !isShapeAddable(textProps)) {
      resetTextProps();
      return; // Blur evt happen but there is not text, Simply reset and return it.
    }

    const shapeProperties = shapeProps.current;
    if (shapeProperties !== null) {
      if (shapeProperties.type === "whiteboard") {
        if (shapeProperties.method === "new") {
          textProps["_id"] = uuid();
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

      const { styleProperties: { fontSize = 18, fontFamily = "roboto" } } = getKonvaProps(textProps) as KonvaText;

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
            shapeValue: { height: newShapeHeight },
          }),
        );
      }

      // Only changes on textArea state whether changes happen on "height" or "width".
      let updatedTextSize: Partial<Texts> = {};
      if (
        textProps.height !== wrappedResult.requiredHeight ||
        textProps.width !== wrappedResult.maxLineWidth
      ) {
        const heightDiff = wrappedResult.requiredHeight - textProps.height;
        const widthDiff = wrappedResult.maxLineWidth - textProps.width;

        updatedTextSize = {
          x: textProps.x - widthDiff / 2,
          y: textProps.y - heightDiff / 2,
          height: wrappedResult.requiredHeight,
          width: wrappedResult.maxLineWidth,
        };
      }

      // Making text addable based on input length.
      if (textProps.isAddable && inputText.length === 0) {
        updatedTextSize["isAddable"] = false;
      } else if (!textProps.isAddable && inputText.length > 0) {
        updatedTextSize["isAddable"] = true;
      }

      setTextProps((prev: Texts | null) => {
        if (prev === null) return null;
        return {
          ...prev,
          ...updatedTextSize,
          text: finalText,
        };
      });
    },
    [dispatch, textProps],
  );

  const handleStageClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (activeTool !== "text") return;

      // Call blur event if clicked on the stage and already textProps is there.
      if (textProps) {
        textAreaRef.current?.blur();
        return;
      }

      const shapeAndTextProps = extractTextShapeProps(e);
      if (shapeAndTextProps?.oldText) {
        shapeProps.current = shapeAndTextProps.oldText.shapeProps;
        setTextProps(shapeAndTextProps.oldText.textProps);
      } else if (shapeAndTextProps?.newText) {
        if (!newShapeProps) return;

        const shapeProperties = shapeAndTextProps.newText.shapeProps;
        shapeProps.current = shapeProperties;

        if (shapeProperties.type !== "whiteboard") {
          shapeHeightLimit.current = shapeProperties.height;
        }

        const textPos = getTextAreaPos(
          shapeProperties.x,
          shapeProperties.y,
          newShapeProps.fontSize,
          newShapeProps.fontFamily,
        );
        setTextProps({
          ...newShapeProps,
          ...textPos,
          shapeId: shapeProperties.id,
          text: "",
        });
      }
    },
    [activeTool, newShapeProps, textProps],
  );

  const handleStageDblClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (activeTool !== "cursor") return; // Only double click work for "Cursor"

      const shapeAndTextProps = extractTextShapeProps(e);
      if (shapeAndTextProps?.oldText) {
        shapeProps.current = shapeAndTextProps.oldText.shapeProps;
        setTextProps(shapeAndTextProps.oldText.textProps);
      } else if (shapeAndTextProps?.newText) {
        const textRawProps = toolBarProperties["text"] as AllToolBarProperties;
        const newTextProps = getShapeProperties(textRawProps);
        const textProps = { ...newTextProps, customProperties: textRawProps } as Texts;

        // Updating the global toolBarProperties.
        dispatch(removeUpdateToolBarProperties(textRawProps));

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
          textProps.fontSize,
          textProps.fontFamily,
        );
        setTextProps({
          ...textProps,
          ...textPos,
          shapeId: shapeProperties.id,
          text: "",
        });
      }
    },
    [activeTool, dispatch, trRef],
  );

  // Handle changes on tool bar props
  useEffect(() => {
    if (!toolBarProps) return;

    setTextProps((prev: Text | null) => {
      if (prev === null) return null;
      const hasFontSizeChanged = prev.styleProperties.fontSize !== toolBarProps.fontSize;
      const hasFontFamilyChanged = prev.styleProperties.fontFamily !== toolBarProps.fontFamily;

      let wrappedText = {};
      if (hasFontSizeChanged || hasFontFamilyChanged) {
        const availableWidth = shapeProps.current?.width as number;
        const toolProps = getShapeProperties({
          fontSize: toolBarProps.fontSize,
          fontFamily: toolBarProps.fontFamily,
        }) as { fontSize: number; fontFamily: string };
        const wrappedResult = wrapText(
          prev.text ?? "",
          availableWidth * 0.98 - 15,
          toolProps.fontSize,
          toolProps.fontFamily,
        );

        wrappedText = {
          height: wrappedResult.requiredHeight,
          width: wrappedResult.maxLineWidth,
          text: wrappedResult.wrappedText,
        };
      }

      return {
        ...prev,
        ...wrappedText,
        ...getShapeProperties(toolBarProps),
        customProperties: toolBarProps,
      } as Texts;
    });
  }, [toolBarProps]);

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

  return textProps ? (
    <div
      style={{
        top: textProps.y,
        left: textProps.x,
        height: textProps.height,
        width: textProps.width,
      }}
      className={`absolute z-50`}
    >
      <textarea
        wrap="off"
        name="text"
        ref={textAreaRef}
        value={textProps.text ?? ""}
        autoFocus
        style={{
          fontSize: textProps.fontSize + "px",
          fontFamily: textProps.fontFamily,
          lineHeight: textProps.fontSize * 1.2 + "px",
          textAlign: textProps.textAlign,
          color: textProps.stroke,
          opacity: textProps.opacity,
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
  ) : null;
}
