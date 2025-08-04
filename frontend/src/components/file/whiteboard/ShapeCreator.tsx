import { Arrow, Ellipse, Rectangle, Shape } from '@/types/shapes';
import Konva from 'konva'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { GetDynamicShape } from './others/const';
import useShapeProperties from '@/hooks/useShapeProperties';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Stage } from 'konva/lib/Stage';
import { KonvaEventObject } from 'konva/lib/Node';
import { TOOLBAR_TOOL_TYPES } from '@/lib/constant';
import { v4 as uuid } from "uuid"
import { ToolType } from '@/types/tools/tool';
import { Coordinates, FourCoordinates } from '@/types';
import { getTransformedPos } from '@/utils/Helper';
import { getUpdatedPropsToAddArrow, recalculatesShapeDimensions } from '@/utils/ShapeUtils';
import useShapeEdgeDetector from '@/hooks/useShapeEdgeDetector';
import { changeActiveTool, setSelectedShapeToAddArrow, setShapes } from '@/redux/slices/appSlice';
import { insertNewShape } from '@/services/shape.api';

interface ShapeCreatorProps {
    stageRef: React.RefObject<Konva.Stage>
}

const ShapeCreator: React.FC<ShapeCreatorProps> = ({ stageRef }) => {
    const [currentShape, setCurrentShape] = useState<Shape | null>(null);
    const mouseStartPos = useRef<{ x: number, y: number } | null>(null);

    const dispatch = useDispatch();
    const { activeTool: { type: activeTool, isLocked }, selectedShapeToAddArrow, shapes } = useSelector((state: RootState) => state.app);
    const newShapeProps = useShapeProperties();
    const { proximity } = useShapeEdgeDetector(10, currentShape);

    // <===================> Helper functions <========================>
    const createNewShape = useCallback((transformedPos: Coordinates) => {
        const shapeProps = {
            _id: uuid(),
            isDrawing: true,
            ...newShapeProps
        }

        if (activeTool === ToolType.PointArrow || activeTool === ToolType.FreeHand) {
            if (activeTool === "point arrow") {
                ((newShapeProps as Arrow)["isDrawingArrow"]) = true
            }

            ((newShapeProps as Arrow)["points"]) = [
                ...Object.values(transformedPos),
            ];
        } else {
            ((shapeProps as Rectangle | Ellipse)["x"]) = transformedPos.x;
            ((shapeProps as Rectangle | Ellipse)["y"]) = transformedPos.y;
        }

        setCurrentShape(shapeProps as Shape);
    }, [activeTool, newShapeProps]);

    const addNewShape = useCallback(
        (customizedCurrentShape?: Shape) => {

            if (currentShape?.isAddable) {
                dispatch(setShapes(customizedCurrentShape ?? { ...currentShape, isDrawing: false }));

                if (!isLocked) {
                    dispatch(
                        changeActiveTool({
                            type: ToolType.Cursor,
                        }),
                    );
                }

                insertNewShape(customizedCurrentShape ?? { ...currentShape, isDrawing: false })
            }

            setCurrentShape(null);
            mouseStartPos.current = null;
        }, [currentShape, dispatch, isLocked])

    const handleShapeAttachment = useCallback(() => {
        const arrowAndShapeValue = getUpdatedPropsToAddArrow(
            shapes,
            selectedShapeToAddArrow,
            currentShape as Arrow
        );

        if (arrowAndShapeValue) {
            dispatch(
                updateExistingShapes({
                    shapeValue: {
                        arrowProps: arrowAndShapeValue.arrowProps,
                    },
                    shapeId: selectedShapeToAddArrow?._id,
                })
            );

            setCurrentShape(
                (prev) => ({
                    ...prev,
                    attachedShape: arrowAndShapeValue?.attachedShape,
                }) as Shape
            );

            dispatch(handleSelectedIds(null));
        }
    }, [currentShape, dispatch, selectedShapeToAddArrow, shapes])

    // <===================> Handle Mouse Events <========================>
    const handleMouseDown = useCallback((e: KonvaEventObject<MouseEvent, Stage>) => {
        e.evt.preventDefault();

        const stage = e.target.getStage();

        if (TOOLBAR_TOOL_TYPES.includes(activeTool) && stage) {
            const transformedPos = getTransformedPos(stage)
            if (!transformedPos) return;

            // Initializing String MousePos
            mouseStartPos.current = {
                x: transformedPos.x,
                y: transformedPos.y
            }

            if (!currentShape) {
                // Handle if drawing is not started
                createNewShape(transformedPos);
            } else {
                // Add new Points to "POINT ARROW" 
                if (activeTool === ToolType.PointArrow) {
                    handleShapeAttachment();
                    (currentShape as Arrow)?.points?.push(transformedPos.x, transformedPos.y)
                }
            }
        }

    }, [activeTool, createNewShape, currentShape, handleShapeAttachment])

    const handleMouseUp = useCallback((e: KonvaEventObject<MouseEvent, Stage>) => {
        e.evt.preventDefault();

        if (TOOLBAR_TOOL_TYPES.includes(activeTool) && currentShape) {
            if (activeTool === ToolType.PointArrow) {
                const arrow = currentShape as Arrow;
                if (arrow?.isDrawingArrow) {
                    // If user click at the start point drawing arrow.
                    // We assume -- User want to create pointed arrow.
                    // Otherwise -- User want to create arrow.
                    if (arrow?.points.length === 2) {
                        setCurrentShape(
                            (prev) => ({
                                ...prev,
                                isDrawingArrow: false,
                            }) as Arrow
                        );
                    } else {
                        addNewShape()
                    }
                }
            } else {
                addNewShape();
            }
        }
    }, [activeTool, addNewShape, currentShape])

    const handleMouseMove = useCallback((e: KonvaEventObject<MouseEvent, Stage>) => {
        e.evt.preventDefault();

        const stage = e.target.getStage();
        if (!stage) return;

        if (TOOLBAR_TOOL_TYPES.includes(activeTool) && currentShape) {
            const transformedPos = getTransformedPos(stage);
            if (!transformedPos) return;

            const updatedCoordinates = { ...mouseStartPos.current, x2: transformedPos.x, y2: transformedPos.y } as unknown as FourCoordinates;

            const updatedShapeValue =
                recalculatesShapeDimensions(
                    activeTool,
                    updatedCoordinates,
                    currentShape,
                );

            setCurrentShape(updatedShapeValue);
        }
    }, [activeTool, currentShape])

    useEffect(() => {

        const stage = stageRef?.current;
        if (!stage) return;

        // Attach event listeners to the document
        stage.on("mousedown", handleMouseDown);
        stage.on("mouseup", handleMouseUp);
        stage.on("mousemove", handleMouseMove);

        return () => {
            // Cleanup event listeners on component getting unmount
            stage.off("mousemove", handleMouseMove);
            stage.off("mousedown", handleMouseDown);
            stage.off("mouseup", handleMouseUp);

        }

    }, [stageRef, handleMouseDown, handleMouseUp, handleMouseMove]);

    useEffect(() => {
        const handleKeyboardEvent = (e: KeyboardEvent) => {
            if (e.key === "Enter" || e.key === "Escape" || e.key === "Delete") {

                if (e.key === "Enter") {
                    const points = (currentShape as Arrow)?.points || [];
                    const slicedPoints = points?.slice(0, points?.length - 2);

                    if (currentShape?.isAddable && slicedPoints.length >= 4) {
                        const updatedShape = {
                            ...currentShape,
                            points: slicedPoints,
                            isDrawing: false
                        };

                        // addShape is missing, either define it or import it
                        createNewShape(updatedShape as Shape);
                        return;
                    }
                }

                setCurrentShape(null);
            }
        };

        document.addEventListener("keydown", handleKeyboardEvent);

        return () => {
            document.removeEventListener("keydown", handleKeyboardEvent);
        };
    }, [createNewShape, currentShape]);

    useEffect(() => {
        if (activeTool !== ToolType.PointArrow) return;

        const { isNear, shapeId, arrowProps } = proximity;
        if (isNear) {
            if (!arrowProps || selectedShapeToAddArrow?._id === shapeId) return;
            dispatch(
                setSelectedShapeToAddArrow(
                    {
                        _id: shapeId as string,
                        x: arrowProps.x,
                        y: arrowProps.y,
                        arrowPosition: arrowProps?.arrowPosition,
                        arrowDirection: arrowProps?.arrowDirection,
                    }
                )
            )
        } else {
            dispatch(setSelectedShapeToAddArrow(null));
        }
    }, [activeTool, dispatch, proximity, selectedShapeToAddArrow?._id])

    return (
        currentShape ? (
            <GetDynamicShape {...currentShape} />
        ) : null
    )
}

export default ShapeCreator
