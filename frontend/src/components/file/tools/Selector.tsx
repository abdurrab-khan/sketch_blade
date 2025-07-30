import { changeToolBarProperties, handleSelectedIds } from '@/redux/slices/appSlice';
import { RootState } from '@/redux/store';
import { ToolType } from '@/types/tools/tool';
import { getTransformedPos } from '@/utils/Helper';
import Konva from 'konva'
import { KonvaEventObject } from 'konva/lib/Node';
import { Stage } from 'konva/lib/Stage';
import React, { useCallback, useEffect, useRef } from 'react'
import { Rect } from 'react-konva';
import { useDispatch, useSelector } from 'react-redux';

interface SelectorProps {
    stageRef: React.RefObject<Konva.Stage>
    trRef: React.RefObject<Konva.Transformer>
    isHovered: boolean,
    setIsHovered: React.Dispatch<React.SetStateAction<boolean>>,
    isDragging: boolean,
    isTransforming: boolean
}

const Selector: React.FC<SelectorProps> = ({ stageRef, trRef, isHovered, setIsHovered, isDragging, isTransforming }) => {
    const dispatch = useDispatch();

    const { activeTool: { type: activeTool }, selectedShapesId } = useSelector((state: RootState) => state.app);
    const selectorRef = useRef<Konva.Rect>(null);
    const mouseStartPos = useRef<{ x: number, y: number } | null>(null);

    // Handle clear selection
    const clearSelection = useCallback((tr: Konva.Transformer) => {
        tr.nodes([]);
        dispatch(handleSelectedIds(null));
        dispatch(changeToolBarProperties(null));
    }, [dispatch]);

    // <===================> Shape Selection via Selector or Click <========================>
    const handleShapeSelectionBySelector = useCallback((tr: Konva.Transformer, stage: Stage, selector: Konva.Rect) => {
        const shapes = stage.find(".shape");
        const box = selector.getClientRect();
        const selected = shapes.filter((s) => Konva.Util.haveIntersection(box, s.getClientRect()));

        if (
            selected.length > 0 &&
            selected.length !== selectedShapesId?._id.length
        ) {
            /* In here we add and remove the selected nodes */
            const ids = selected.map((shape) => shape.attrs.id);
            const selectedShapes = selected.map((items) => items.attrs);

            // Add Selection Shape -- Global Transformer
            tr.nodes(selected);

            dispatch(handleSelectedIds({ _id: ids, purpose: "FOR_EDITING" }));
            dispatch(changeToolBarProperties(selectedShapes));
        } else if (selected.length === 0) {
            tr.nodes([]);
            dispatch(handleSelectedIds(null));
            dispatch(changeToolBarProperties(null));
        }
    }, [dispatch, selectedShapesId?._id.length]);

    // <===================> Handle Mouse Events <========================>
    const handleShapeSelectionByClick = useCallback((e: KonvaEventObject<MouseEvent>) => {
        const tr = trRef.current;
        if (!tr || e.target.nodeType !== "Shape") return;

        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr.nodes().indexOf(e.target) >= 0;

        if (!metaPressed) {
            tr.nodes([e.target]);
        } else {
            let nodes = [];

            if (isSelected) {
                nodes = tr.nodes().slice();
                nodes.splice(nodes.indexOf(e.target), 1);
            } else {
                nodes = tr.nodes().slice();
                nodes.push(e.target);
            }

            tr.nodes(nodes);
        }

        if (Array.isArray(tr.nodes()) && tr.nodes().length > 0) {
            const nodesAttr = tr.nodes().map((shape) => shape.attrs);
            const ids = nodesAttr.map((attr) => attr.id);

            dispatch(changeToolBarProperties(nodesAttr));
            dispatch(handleSelectedIds({ _id: ids, purpose: "FOR_EDITING" }));
        }
    }, [dispatch, trRef]);

    const handleMouseDown = useCallback((e: KonvaEventObject<MouseEvent, Stage>) => {
        const selector = selectorRef.current;
        const stage = stageRef.current;
        const tr = trRef.current;
        if (!(selector && stage && tr)) return;

        const transformedPos = getTransformedPos(stage);
        if (!transformedPos) return;


        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const nodeType = e.target.nodeType;

        if (activeTool === ToolType.Cursor) {
            // Handle mouse down whether nodeType is "Stage" and "Shape".
            if (nodeType === "Stage") {
                const isNodesTheir = tr.nodes().length > 0;

                if (!selector?.visible()) {
                    // Initialize mouse start position.
                    mouseStartPos.current = {
                        x: transformedPos.x,
                        y: transformedPos.y,
                    }

                    selector?.height(0);
                    selector?.width(0);
                    selector?.visible(true);
                }

                if (isNodesTheir) {
                    clearSelection(tr);
                }
            } else if (nodeType === "Shape") {
                const isSelected = tr.nodes().indexOf(e.target) >= 0;
                if (!isSelected && !metaPressed) {
                    tr.nodes([e.target]);
                }

                if (Array.isArray(tr.nodes()) && tr.nodes().length > 0) {
                    const nodesAttr = tr.nodes().map((shape) => shape.attrs);
                    const ids = nodesAttr.map((attr) => attr.id);

                    dispatch(changeToolBarProperties(nodesAttr));
                    dispatch(handleSelectedIds({ _id: ids, purpose: "FOR_EDITING" }));
                }
                // handleShapeSelectionByClick(e);
            }
        }
    }, [activeTool, clearSelection, dispatch, stageRef, trRef]);

    const handleMouseClick = useCallback((e: KonvaEventObject<MouseEvent, Stage>) => {
        if (e.target.nodeType !== "Shape") return;

        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const tr = trRef.current;
        const selectedIds = selectedShapesId?._id
        if (!tr || !selectedIds) return;

        const isSelected = tr.nodes().indexOf(e.target) >= 0;
        if (metaPressed) {
            let nodes = tr.nodes().slice();
            if (!isSelected) {
                nodes.push(e.target);
            } else {
                nodes = tr.nodes().slice();
                nodes.splice(nodes.indexOf(e.target), 1);
            }

            tr.nodes(nodes);
        } else {
            tr.nodes([e.target]);
        }

    }, [selectedShapesId?._id, trRef]);

    const handleMouseUp = useCallback(() => {
        const selector = selectorRef.current;

        if (activeTool === ToolType.Cursor && selectorRef?.current?.visible()) {
            selector?.visible(false);
        }
    }, [activeTool]);

    const handleMouseMove = useCallback((e: KonvaEventObject<MouseEvent, Stage>) => {
        const stage = stageRef.current;
        const selector = selectorRef.current;
        const tr = trRef.current;
        const startingMousePos = mouseStartPos.current;

        if (activeTool === ToolType.Cursor) {
            // Set hover if target is shape
            if (e.target.hasName("shape") && !isHovered) {
                setIsHovered(true);
            } else if (!e.target.hasName("shape") && isHovered) {
                setIsHovered(false);
            }

            // Handling selector size.
            if (!(selector && stage && startingMousePos && tr)) return;

            const transformedPos = getTransformedPos(stage);
            if (!transformedPos) return;

            if (selectorRef.current?.visible()) {
                // Set selector rect attrs
                selector?.setAttrs({
                    x: Math.min(startingMousePos.x, transformedPos.x),
                    y: Math.min(startingMousePos.y, transformedPos.y),
                    width: Math.abs(transformedPos.x - startingMousePos.x),
                    height: Math.abs(transformedPos.y - startingMousePos.y),
                });

                // Handle selected shape based on selection rect interaction
                handleShapeSelectionBySelector(tr, stage, selector)
            }
        }

    }, [activeTool, handleShapeSelectionBySelector, isHovered, setIsHovered, stageRef, trRef]);

    useEffect(() => {
        const stage = stageRef?.current;
        if (!stage) return;

        // Attach event listeners to the document
        stage.on("click", handleMouseClick)
        stage.on("mousedown", handleMouseDown);
        stage.on("mouseup", handleMouseUp);
        stage.on("mousemove", handleMouseMove)

        return () => {
            // Clean up event listeners on component unmount
            stage.off("click", handleMouseClick);
            stage.off("mousedown", handleMouseDown);
            stage.off("mousemove", handleMouseMove);
            stage.off("mouseup", handleMouseUp);
        }

    }, [handleMouseClick, handleMouseDown, handleMouseMove, handleMouseUp, stageRef]);

    return (
        <Rect
            ref={selectorRef}
            fill={"rgba(147,146,146,0.22)"}
            stroke={"#bdbcf4"}
            strokeWidth={1}
            visible={false}
            listening={false}
        />
    )
}

export default Selector
