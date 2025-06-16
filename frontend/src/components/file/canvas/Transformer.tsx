import React from 'react'
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Transformer as KonvaTransformer } from 'react-konva';

interface TransformerProps {
    handleTransforming?: (e: KonvaEventObject<MouseEvent>) => void;
    handleTransformingEnd: (e: KonvaEventObject<MouseEvent>) => void;
    handleDragMove: (e: KonvaEventObject<MouseEvent>) => void;
    handleDragEnd: (e: KonvaEventObject<MouseEvent>) => void;
}

const Transformer = React.forwardRef<Konva.Transformer, TransformerProps>(
    ({ handleTransforming, handleTransformingEnd, handleDragMove, handleDragEnd }, ref) => {
        return (
            <KonvaTransformer
                ref={ref}
                anchorCornerRadius={1.5}
                anchorSize={9}
                rotateLineVisible={false}
                anchorFill={"#1b262c"}
                ignoreStroke={true}
                anchorStyleFunc={(anchor) => {
                    const node = anchor?.getParent();

                    if (!node) return;

                    if (anchor.hasName("top-center") || anchor.hasName("bottom-center")) {
                        anchor.height(6);
                        anchor.width(30);
                        anchor.opacity(0);
                    }

                    // For middle anchors - full height
                    if (anchor.hasName("middle-left") || anchor.hasName("middle-right")) {
                        anchor.height(30);
                        anchor.width(6);
                        anchor.opacity(0);
                    }

                    // For rotating anchor (top-right corner)
                    if (anchor.hasName("rotater")) {
                        anchor.cornerRadius(8);
                    }
                }}
                onTransform={handleTransforming}
                onTransformEnd={handleTransformingEnd}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
            />
        )
    }
);

export default Transformer