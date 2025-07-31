import { CommonText } from '@/types/shapes';
import { getTextAreaHeight, getTextAreaWidth } from '@/utils/TextUtils';
import Konva from 'konva'
import { KonvaEventObject } from 'konva/lib/Node';
import React, { useCallback, useEffect, useState } from 'react'

interface TextHandlerProps {
    stageRef: React.RefObject<Konva.Stage>
}

interface TextProps {
    textAreaX: number,
    textAreaY: number,
    textAreaHeight: number,
    textAreaWidth: number,
    text: CommonText | null
}

const DEFAULT_FONT_SIZE = 18;
const DEFAULT_FONT_FAMILY = "roman";

const extractShapeProps = (e: KonvaEventObject<MouseEvent>): TextProps | null => {
    let textAreaX, textAreaY, textAreaHeight, textAreaWidth, text;
    const target = e.target;
    const parent = target.nodeType !== "Stage" ? target.getParent() : target;

    if (parent?.nodeType === "Group") {
        const shape = (parent as Konva.Group).findOne(".shape");
        if (!shape) return null;

        const x = parent.x();
        const y = parent.y();
        text = shape?.attrs?.text ?? null;

        const fontSize = text ? text.fontSize : DEFAULT_FONT_SIZE;
        const fontFamily = text ? text.fontFamily : DEFAULT_FONT_FAMILY;

        // Calculate text size based on text size and other factors
        textAreaHeight = getTextAreaHeight(text, fontSize);
        textAreaWidth = getTextAreaWidth(text, fontSize, fontFamily);
        textAreaX = x - (textAreaHeight / 2);
        textAreaY = y - (textAreaWidth / 2);
    } else {
        return null
    }

    return {
        textAreaX,
        textAreaY,
        textAreaHeight,
        textAreaWidth,
        text
    };
}

export default function TextHandler({ stageRef }: TextHandlerProps) {
    const [textProps, setTextProps] = useState<TextProps | null>(null);

    const handleStageDblClick = useCallback((e: KonvaEventObject<MouseEvent>) => {
        const shape = extractShapeProps(e);

        if (shape) {
            setTextProps(shape)
        }
    }, []);

    useEffect(() => {
        const stage = stageRef?.current;
        if (!stage) return;

        stage.on("dblclick", handleStageDblClick);
        return () => {
            stage.off("dblclick", handleStageDblClick)
        }
    }, [handleStageDblClick, stageRef])

    return (
        textProps ? (
            <div
                style={{
                    top: textProps.textAreaY,
                    left: textProps.textAreaX,
                    height: textProps.textAreaHeight,
                    width: textProps.textAreaWidth
                }}
                className={`absolute z-50`}
            >
                <textarea
                    wrap='off'
                    autoFocus
                    style={{
                        fontSize: textProps?.text ? textProps.text.fontSize : DEFAULT_FONT_SIZE,
                        lineHeight: textProps?.text ? textProps.text.fontSize : DEFAULT_FONT_SIZE
                    }}
                    className='size-full bg-blue-500 m-0 p-0 resize-none border-none outline-none text-center box-content'
                />
            </div>
        ) : null
    )
}
