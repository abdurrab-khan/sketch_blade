import Konva from 'konva'
import { toolBarProperties as toolBarProps } from '@/lib/constant';
import { removeUpdateToolBarProperties } from '@/redux/slices/appSlice';
import { RootState } from '@/redux/store';
import { Texts } from '@/types/shapes';
import { KonvaEventObject } from 'konva/lib/Node';
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import useShapeProperties from '@/hooks/useShapeProperties';
import { TextToolProps, ToolType } from '@/types/tools/tool';

interface TextHandlerProps {
    stageRef: React.RefObject<Konva.Stage>
}

interface ShapeProps {
    id: string | null,
    x: number,
    y: number,
    height: number,
    width: number,
    text: string[] | null
}

interface ExtractShapeProps {
    id?: string,
    x: number,
    y: number,
    height: number,
    width: number,
    text: string[] | null,
}

const extractShapeProps = (e: KonvaEventObject<MouseEvent>): ExtractShapeProps | null => {
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
        }
    } else if (parent?.nodeType === 'Stage') {
        const x = e.evt.clientX;
        const y = e.evt.clientY;

        return {
            x,
            y,
            text: null,
            height: e.target.height(),
            width: e.target.width()
        }
    }

    return null;
}

export default function TextHandler({ stageRef }: TextHandlerProps) {
    const shapeProps = useRef<ShapeProps | null>(null);
    const [textProps, setTextProps] = useState<Texts | null>(null);

    const dispatch = useDispatch();
    const activeTool = useSelector((state: RootState) => state.app.activeTool.type);
    const toolBarProperties = useSelector((state: RootState) => state.app.toolBarProperties);
    const newShapeProps = useShapeProperties();

    // <===================> HELPER FUNCTIONS <===================>  


    // <===================> MOUSE EVENT HANDLER <===================>  
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        return "";
    }

    const handleStageClick = useCallback((e: KonvaEventObject<MouseEvent>) => {
        if (activeTool !== ToolType.Text && newShapeProps) return;

        console.log(e)

    }, [activeTool, newShapeProps])

    const handleStageDblClick = useCallback((e: KonvaEventObject<MouseEvent>) => {
        const textToolProps = toolBarProps["text"] as TextToolProps;

        const shape = extractShapeProps(e);
        if (shape) {
            const { id = null, x, y, text, height, width } = shape;

            shapeProps.current = {
                id,
                x,
                y,
                height,
                width,
                text
            };
            dispatch(removeUpdateToolBarProperties(textToolProps));
        }
    }, [dispatch]);

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

    // useEffect(() => {
    //     if (shapeProps.current === null) return;

    //     const textToolProps = toolBarProperties;
    //     if (textToolProps && (textToolProps["fontSize"] && textToolProps["fontFamily"])) {
    //         const extractTextProps = getShapeProperties(Object.keys(textToolProps), textToolProps) as TextToolProps;

    //         const { x, y, text } = shapeProps.current;

    //         const textAreaProps = calculateTextAreaProps(x, y, text, (extractTextProps.fontSize as unknown as number), extractTextProps.fontFamily);
    //     };
    // }, [toolBarProperties]);

    console.log(newShapeProps)

    return (
        textProps ? (
            <div
                style={{
                    top: textProps.x,
                    left: textProps.y,
                    height: textProps.height,
                    width: textProps.width
                }}
                className={`absolute z-50`}
            >
                <textarea
                    wrap='off'
                    name='text'
                    autoFocus
                    style={{
                        fontSize: textProps.fontSize + "px",
                        lineHeight: textProps.fontSize + "px",
                        textAlign: textProps.textAlign,
                        color: textProps.stroke
                    }}
                    className='size-full bg-blue-500 m-0 p-0 text-center box-content border-none outline-none resize-none overflow-hidden'
                    onChange={handleInput}
                    onBlur={(e) => {
                        console.log("Hello world")
                        if (e.relatedTarget && e.relatedTarget.getAttribute('name') !== "tools") {
                            setTextProps(null);
                            shapeProps.current = null;
                        }
                        e.target.focus();
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            (e.target as HTMLTextAreaElement).blur(); // Calling the blur event
                        }
                    }}
                />
            </div>
        ) : null
    )
}
