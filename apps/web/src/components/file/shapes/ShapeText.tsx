import React, { useMemo } from 'react'
import { KonvaTextSupportedShapes } from '@/types/shapes'
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Text } from 'react-konva';

interface IShapeText {
    shapeId: string;
    shape: KonvaTextSupportedShapes
}

const ShapeText: React.FC<IShapeText> = ({ shapeId, shape }) => {
    const selectedShapeId = useSelector((state: RootState) => state.app.selectedShapesId);
    const isUpdating = useMemo(() => {
        return (
            !Array.isArray(selectedShapeId) &&
            selectedShapeId?.purpose === "FOR_EDITING" &&
            selectedShapeId._id === shapeId
        );
    }, [selectedShapeId, shapeId])

    // Return nothing if no text in shape
    if (shape?.text == undefined || isUpdating) return <></>

    return (
        <Text
            {...shape.styleProperties}
            x={shape.styleProperties.width / 2}
            y={shape.styleProperties.height / 2}
        />
    )
}

export default ShapeText
