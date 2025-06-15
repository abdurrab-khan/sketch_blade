import { handleSelectedIds } from '@/redux/slices/appSlice'
import { RootState } from '@/redux/store'
import Konva from 'konva'
import { KonvaEventObject } from 'konva/lib/Node'
import { RefObject, useEffect } from 'react'
import { Group } from 'react-konva'
import { useDispatch, useSelector } from 'react-redux'

interface ShapeGroupProps {
    children: any,
    trRef: RefObject<Konva.Transformer>,
    groupRef?: RefObject<Konva.Group>,
    _id: string
}

export default function ShapeGroup({ _id, groupRef, trRef, children }: ShapeGroupProps) {
    const selectedShapes = useSelector((state: RootState) => state.app.selectedShapesId)
    const dispatch = useDispatch();

    // Toggle -- Adding is removing shape ids.
    const handleGroupClick = (e: KonvaEventObject<MouseEvent>) => {
        e.evt.preventDefault();

        const tr = trRef?.current;
        if (!tr) return;

        const metaPressed = e.evt.ctrlKey || e.evt.shiftKey || e.evt.metaKey;
        if ((metaPressed && selectedShapes)) return;


        const id = selectedShapes?._id === _id ? null : { _id: _id };

        tr.nodes(id ? [e.target] : [])
        dispatch(handleSelectedIds(id))
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
        <Group ref={groupRef} onClick={handleGroupClick}>
            {children}
        </Group>
    )
}
