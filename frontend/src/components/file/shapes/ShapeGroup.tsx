import { changeToolBarProperties, handleSelectedIds } from '@/redux/slices/appSlice'
import { RootState } from '@/redux/store'
import { ToolType } from '@/types/tools/tool'
import Konva from 'konva'
import { KonvaEventObject } from 'konva/lib/Node'
import { RefObject, useEffect } from 'react'
import { Group } from 'react-konva'
import { useDispatch, useSelector } from 'react-redux'

interface ShapeGroupProps {
    _id: string,
    type: ToolType,
    children: React.ReactNode,
    trRef: RefObject<Konva.Transformer>,
    groupRef?: RefObject<Konva.Group>,
    [key: string]: any
}

export default function ShapeGroup({ _id, groupRef, type, trRef, children, ...props }: ShapeGroupProps) {
    const activeTool = useSelector((state: RootState) => state.app.activeTool);
    const selectedShapes = useSelector((state: RootState) => state.app.selectedShapesId)
    const dispatch = useDispatch();

    // Toggle -- Handle mouse down event
    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        e.evt.preventDefault();

        // Only select -- When activeTool is cursor
        if (activeTool.type !== ToolType.Cursor) return;

        // Return -- If the target is not a shape or drawing is happening 
        if (e.target.attrs.isDrawing || e.target.attrs.name !== "shape") return;

        const metaPressed = e.evt.ctrlKey || e.evt.shiftKey || e.evt.metaKey;
        if (!metaPressed) {
            // Check -- whether selectedShapesIds is array -- if yes return it.
            if (Array.isArray(selectedShapes?._id)) return;

            const isSelected = selectedShapes?._id === _id;
            if (!isSelected) {
                // Extract transformer for trRef
                const tr = trRef?.current;

                if (tr) {
                    tr.nodes([e.target])
                };

                // Add id into selectedIds and also insert properties
                dispatch(handleSelectedIds({ _id: _id }))
                dispatch(changeToolBarProperties([e.target?.attrs]));

                // Check -- In the props is we have is  setIsClicked means it is for arrow
                if (e.target.attrs.type === "point arrow") {
                    props.setIsClicked(true);
                }
            }
        }


    }

    // Toggle -- Handle mouse down event
    const handleMouseClick = (e: KonvaEventObject<MouseEvent>) => {
        e.evt.preventDefault();

        if (activeTool.type !== ToolType.Cursor) return;

        // Return -- If the target is not a shape or drawing is happening 
        if (e.target.attrs.isDrawing || e.target.attrs.name !== "shape") return;

        const metaPressed = e.evt.ctrlKey || e.evt.shiftKey || e.evt.metaKey;
        if (!metaPressed) {
            // Check -- When selectedShape?._id is array if yes -- clicked shape into the transformer
            if (Array.isArray(selectedShapes?._id)) {

                // Extract transformer for trRef
                const tr = trRef?.current;

                if (tr) {
                    tr.nodes([e.target])
                };

                // Add id into selectedIds and also insert properties
                dispatch(handleSelectedIds({ _id: _id }))
                dispatch(changeToolBarProperties([e.target?.attrs]));

                // Check -- In the props is we have is  setIsClicked means it is for arrow
                if (e.target.attrs.type === "point arrow") {
                    props.setIsClicked(true);
                }
            }
        }
    }

    useEffect(() => {
        if (selectedShapes?._id === _id) return;

        const tr = trRef?.current;

        if (tr && tr.nodes().length > 0) {
            tr.nodes([])
        };

        if (type === ToolType.PointArrow) {
            if (props.isClicked) {
                props.setIsClicked(false);
            }
        }
    }, [selectedShapes, trRef, _id, props, type])

    return (
        <Group
            ref={groupRef}
            onClick={handleMouseClick}
            onMouseDown={handleMouseDown}
        >
            {children}
        </Group>
    )
}
