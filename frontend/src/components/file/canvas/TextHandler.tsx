import Konva from 'konva'
import { KonvaEventObject } from 'konva/lib/Node';
import React, { useCallback, useEffect, useState } from 'react'

interface TextHandlerProps {
    stageRef: React.RefObject<Konva.Stage>
}


const extractShape = (e: KonvaEventObject<MouseEvent>): { x: number, y: number, height: number, width: number } | null => {
    let x, y, height, width;
    const target = e.target;
    const parent = target.nodeType !== "Stage" ? target.getParent() : target;

    if (parent?.nodeType === "Group") {
        const shape = (parent as Konva.Group).findOne(".shape");
        if (!shape) return null;

        x = parent.x();
        y = parent.y();
        height = shape.height();
        width = shape.width();
    } else {
        console.log(parent)
        return null
    }

    return {
        x,
        y,
        height,
        width
    };
}

export default function TextHandler({ stageRef }: TextHandlerProps) {
    const [props, setProps] = useState(null);

    const handleStageDblClick = useCallback((e: KonvaEventObject<MouseEvent>) => {
        const shape = extractShape(e);

        if (shape) {
            const { x, y, height, width } = shape;

            setProps({ x, y });
            console.log({ x, y, height, width })
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
        props && (
            <div
                style={{ left: props.x, top: props.y }}
                className={`absolute bg-yellow-500 m-0 p-0 h-20 w-20 z-50`}
            >

            </div>
        )
    )
}
