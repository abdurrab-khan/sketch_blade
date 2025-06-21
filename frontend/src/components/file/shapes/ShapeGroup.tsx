import { changeToolBarProperties, handleSelectedIds } from '@/redux/slices/appSlice'
import { RootState } from '@/redux/store'
import Konva from 'konva'
import { KonvaEventObject } from 'konva/lib/Node'
import { RefObject, useEffect } from 'react'
import { Group } from 'react-konva'
import { useDispatch, useSelector } from 'react-redux'

interface ShapeGroupProps {
    _id: string,
    children: React.ReactNode,
    trRef: RefObject<Konva.Transformer>,
    groupRef?: RefObject<Konva.Group>,
    [key: string]: any
}

export default function ShapeGroup({ _id, groupRef, trRef, children, ...props }: ShapeGroupProps) {
    const selectedShapes = useSelector((state: RootState) => state.app.selectedShapesId)
    const dispatch = useDispatch();

    // Toggle -- Handle mouse down event
    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        e.evt.preventDefault();

        // Return -- If name of the shape is not "SHAPE"
        if (e.target.attrs.name !== "shape") return;

        const tr = trRef?.current;
        if (!tr) return;

        // Check -- When meta-pressed and already selectedShape is there.
        // If this happen this implementation is there useStageHandler
        const metaPressed = e.evt.ctrlKey || e.evt.shiftKey || e.evt.metaKey;
        if ((metaPressed && selectedShapes)) return;

        // Check -- whether selectedShapesIds is array -- if yes return it.
        if (Array.isArray(selectedShapes?._id)) return;


        // Validate -- selectedShapeId should not equal to current id. 
        if (selectedShapes?._id !== _id) {
            const id = { _id: _id };

            tr.nodes([e.target])
            dispatch(handleSelectedIds(id))
            dispatch(changeToolBarProperties([e.target?.attrs]));

            // Check -- In the props is we have is  setIsClicked means it is for arrow
            if (props.setIsClicked) {
                props.setIsClicked(true);
            }
        }
    }


    // Toggle -- Handle mouse down event
    const handleMouseClick = (e: KonvaEventObject<MouseEvent>) => {
        e.evt.preventDefault();

        const metaPressed = e.evt.ctrlKey || e.evt.shiftKey || e.evt.metaKey;

        // Return -- When meta button is pressed.
        if (metaPressed) return;

        const tr = trRef?.current;
        if (!tr) return;

        // Check -- When selectedShape?._id is array if yes -- clicked shape into the transformer
        if (Array.isArray(selectedShapes?._id)) {
            tr.nodes([e.target])
            dispatch(handleSelectedIds({ _id: _id }))
            dispatch(changeToolBarProperties([e.target?.attrs]));
        }
    }

    useEffect(() => {
        const tr = trRef?.current;
        if (!tr) return;

        // Checking -- Whether we have selectedShape ID and inside transformer we have shapes or not.
        if (trRef.current?.nodes().length === 0 || selectedShapes?._id === _id) return;

        // Checking -- Whether selectedShapes ID and current ID is same or not
        tr.nodes([])
    }, [selectedShapes, trRef, _id])

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
