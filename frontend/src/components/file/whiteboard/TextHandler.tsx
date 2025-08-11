import React, { useCallback, useEffect, useRef, useState } from 'react'
import useShapeProperties from '@/hooks/useShapeProperties';
import { ToolType } from '@/types/tools/tool';
import { calTextAreaPosForShape, extractShapeProps, getMaxedString, sliceStringFixed, wrapText, wrapTextSimple } from '@/utils/TextUtils';
import { v4 as uuid } from "uuid"
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FontFamily, Text, Texts } from '@/types/shapes';
import { KonvaEventObject } from 'konva/lib/Node';
import Konva from 'konva';
import { getShapeProperties } from '@/utils/ShapeUtils';

interface TextHandlerProps {
    stageRef: React.RefObject<Konva.Stage>
}

interface ShapeProps {
    id: string | null,
    x: number,
    y: number,
    height: number,
    width: number,
    type: "shape" | "whiteboard",
}

interface ExtractShapeProps {
    id?: string,
    x: number,
    y: number,
    height: number,
    width: number,
}

interface TextWrapResult {
    wrappedText: string;
    lines: string[];
    requiredHeight: number;
    maxLineWidth: number;
}

// Utility Functions for Text Wrapping


export default function TextHandler({ stageRef }: TextHandlerProps) {
    const shapeProps = useRef<ShapeProps | null>(null);
    const shapeHeightLimit = useRef<number | null>(null);
    const [text, setText] = useState<string>('');
    const [textProps, setTextProps] = useState<Texts | null>(null);

    const dispatch = useDispatch();
    const activeTool = useSelector((state: RootState) => state.app.activeTool.type);
    const toolBarProps = useSelector((state: RootState) => state.app.toolBarProperties);
    const newShapeProps = useShapeProperties();

    // Helper function to generate new text properties
    const generateNewTextProps = useCallback((behindShape: ShapeProps, fontSize: number, fontFamily: FontFamily, text: string[] | null): Texts | null => {
        const { id, x, y } = behindShape;
        const textPos = calTextAreaPosForShape(x, y, text, fontSize, fontFamily);
        shapeProps.current = behindShape;

        // Store initial height limit
        if (behindShape.height > 0 && behindShape.type === "shape") {
            shapeHeightLimit.current = behindShape.height;
        }

        return {
            _id: uuid(),
            shapeId: id,
            text: text ?? null,
            ...textPos,
            ...newShapeProps
        } as Text
    }, [newShapeProps])

    // Main input handler with improved text wrapping
    const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const shapePos = shapeProps.current;

        if (!(shapePos && textProps)) return;

        const inputText = e.target.value;
        const availableWidth = (shapePos.width * 0.98) - 15;
        const fontSize = textProps.fontSize;
        const fontFamily = textProps.fontFamily;

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

        // Calculate text area position based on wrapped lines
        const textAreaPos = calTextAreaPosForShape(
            shapePos.x,
            shapePos.y,
            wrappedResult.lines,
            fontSize,
            fontFamily
        );

        // Calculate required shape height with padding
        const requiredShapeHeight = wrappedResult.requiredHeight + (fontSize * 0.5);
        const minHeight = shapeHeightLimit.current || shapePos.height;
        const newShapeHeight = Math.max(minHeight, requiredShapeHeight);

        // Update shape height if needed
        if (Math.abs(newShapeHeight - shapePos.height) > 1) {
            shapeProps.current = {
                ...(shapeProps.current || {}),
                height: newShapeHeight
            }

            // // Update shape in the state
            // if (typeof setShape === 'function') {
            //     setShape((prev: any[]) =>
            //         prev.map((s) =>
            //             s.id === (textEditor?.shapeProps?.id || shapePos.id)
            //                 ? { ...s, height: newShapeHeight }
            //                 : s
            //         )
            //     );
            // }
        }

        console.log(wrappedResult)

        // Only changes on textArea state whether changes happen on "height" or "width". 
        if ((textProps.height !== textAreaPos.height) || (textProps.width !== textAreaPos.width)) {
            setTextProps((prev: Texts | null) => {
                if (prev === null) return null;
                return {
                    ...prev,
                    height: wrappedResult.requiredHeight,
                    width: wrappedResult.maxLineWidth
                };
            });
        }

        setText(finalText);
    }, [textProps])

    const handleStageClick = useCallback((e: KonvaEventObject<MouseEvent>) => {
        if (!(activeTool === ToolType.Text && newShapeProps)) return;

        const target = e.target;
        const x = e.evt.clientX, y = e.evt.clientY;

        if (target.nodeType === "Text") {
            const text = e.target;
            setTextProps(text.attrs);
        } else if (target.nodeType === "Stage") {
            const newText = generateNewTextProps(
                { id: null, x, y, height: target.attrs.height / 5, width: 300, type: "whiteboard" },
                (newShapeProps as Text).fontSize,
                (newShapeProps as Text).customProperties.fontFamily,
                null
            );

            setTextProps(newText)
        }
    }, [activeTool, generateNewTextProps, newShapeProps])

    const handleStageDblClick = useCallback((e: KonvaEventObject<MouseEvent>) => {
        // const textToolProps = toolBarProps["text"] as TextToolProps;

        const shape = extractShapeProps(e);
        if (shape) {
            const { id = null, x, y, height, width } = shape;

            shapeProps.current = {
                id,
                x,
                y,
                height,
                width,
                type: "shape"
            };

            shapeHeightLimit.current = height;
            // dispatch(removeUpdateToolBarProperties(textToolProps));
        }
    }, []);

    // Handle changes on tool bar props
    useEffect(() => {
        if (!toolBarProps) return;

        setTextProps((prev: Texts | null) => {
            if (prev === null) return null;

            if (prev.customProperties.fontSize !== toolBarProps.fontSize) {
                console.log("Change width.....")
            }

            return {
                ...prev,
                ...getShapeProperties(toolBarProps),
                customProperties: toolBarProps
            } as Texts;
        })
    }, [toolBarProps]);

    useEffect(() => {
        const stage = stageRef?.current;
        if (!stage) return;

        stage.on("dblclick", handleStageDblClick);
        stage.on("click", handleStageClick)

        return () => {
            stage.off("dblclick", handleStageDblClick)
            stage.off("click", handleStageClick)
        }
    }, [stageRef, handleStageClick, handleStageDblClick]);

    return (
        textProps ? (
            <div
                style={{
                    top: textProps.y,
                    left: textProps.x,
                    height: textProps.height,
                    width: textProps.width
                }}
                className={`absolute z-50`}
            >
                <textarea
                    wrap='off'
                    name='text'
                    value={text}
                    autoFocus
                    style={{
                        fontSize: textProps.fontSize + "px",
                        fontFamily: textProps.fontFamily,
                        lineHeight: (textProps.fontSize * 1.2) + "px",
                        textAlign: textProps.textAlign,
                        color: textProps.stroke,
                        opacity: textProps.opacity,
                        padding: '4px'
                    }}
                    className='size-full bg-blue-500 m-0 box-content border-none outline-none resize-none overflow-hidden'
                    onChange={handleInput}
                    onBlur={(e) => {
                        console.log("Text editor blur");
                        if (e.relatedTarget && e.relatedTarget.getAttribute('name') !== "tools") {
                            setTextProps(null);
                            shapeProps.current = null;
                            shapeHeightLimit.current = null;
                        }
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            (e.target as HTMLTextAreaElement).blur();
                        }
                    }}
                />
            </div>
        ) : null
    )
}