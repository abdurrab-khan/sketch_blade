import React from 'react'
import { KonvaTextSupportedShapes } from '@/types/shapes'

interface IShapeText {
    shape: KonvaTextSupportedShapes
}

const ShapeText: React.FC<IShapeText> = ({ shape }) => {

    // Return nothing if no text in shape
    if (shape?.text == undefined) return <></>

    return (
        <div>
        </div>
    )
}

export default ShapeText
