import { createSlice } from "@reduxjs/toolkit";

// Utils
import {
  DeletedShapeProps,
  getShapeProperties,
} from "../../utils/ShapeUtils.ts";
import { getCombineShapeProps } from "../../utils/Tool.ts";

// Common
import { SelectionPurpose } from "../../types/shapes/common.ts";

// Types
import { Arrow, AttachedShape } from "../../types/shapes/arrow.ts";
import { ArrowProps, SelectedShapesId } from "../../types/index.ts";
import { ArrowSupportedShapes, Shape } from "../../types/shapes/shape-union.ts";
import {
  ActiveTool,
  ToolBarProperties,
  ToolType,
} from "../../types/tools/tool.ts";

type AppState = {
  clerkId: string | null;
  shapes: Shape[];
  activeTool: ActiveTool;
  toolBarProperties: ToolBarProperties | null;
  selectedShapesId: SelectedShapesId | null;
  selectedShapeToAddArrow: ArrowProps | null;
};

const initialState: AppState = {
  clerkId: null,
  shapes: [],
  activeTool: {
    type: ToolType.Cursor,
    isLocked: false,
  },
  toolBarProperties: null,
  selectedShapesId: null,
  selectedShapeToAddArrow: null,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    changeActiveTool: (
      state,
      action: {
        payload: {
          type?: ToolType;
          isLocked?: boolean;
        };
      },
    ) => {
      const { type = null, isLocked = null } = action.payload;

      state.activeTool = {
        type: type === null ? state.activeTool.type : type,
        isLocked: isLocked === null ? state.activeTool.isLocked : isLocked,
      };
    },
    changeToolBarPropertiesValue: (state, action) => {
      const payload = action.payload;
      if (!payload) return;
      if (!state.shapes || !state.selectedShapesId?._id.length) return;

      state.selectedShapesId?._id.forEach((_id) => {
        const shapeIndex = state.shapes.findIndex((shape) => shape._id === _id);

        if (shapeIndex !== -1) {
          const propertyKey: keyof ToolBarProperties = Object.keys(
            action.payload,
          )[0] as keyof ToolBarProperties;
          const shape = state.shapes[shapeIndex];

          const updatedProperties = getShapeProperties(
            shape.type,
            [propertyKey],
            action.payload,
          );

          state.shapes[shapeIndex] = {
            ...state.shapes[shapeIndex],
            customProperties: {
              ...state.shapes[shapeIndex].customProperties,
              ...payload,
            },
            ...updatedProperties,
          };
        }
      });

      state.toolBarProperties = {
        ...state.toolBarProperties,
        ...payload,
      };
    },
    changeToolBarProperties: (state, action) => {
      const attrs = action.payload;

      if (!attrs || attrs.length === 0) {
        state.toolBarProperties = null;
        return;
      }

      state.toolBarProperties = getCombineShapeProps(attrs);
    },
    setShapes: (state, action) => {
      const shapes: Shape = action.payload;

      if (shapes && state.shapes.length) {
        state.shapes = [shapes];
      } else {
        state.shapes.push(shapes);
      }
    },
    updateExistingShapes: (
      state,
      action: {
        payload:
          | {
              shapeId?: string;
              shapeIndex?: number;
              shapeValue: Partial<Shape>;
            }
          | {
              shapeId: string;
              shapeValue: Partial<Shape>;
            }[];
      },
    ) => {
      const updates = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      updates.forEach((update) => {
        let index =
          (update as unknown as { shapeIndex: number })?.shapeIndex ?? null;

        if (!index) {
          index = state.shapes.findIndex(
            (shape) => shape._id === update.shapeId,
          );
        }

        if (index !== -1) {
          state.shapes[index] = {
            ...state.shapes[index],
            ...update.shapeValue,
          } as Shape;
        }
      });
    },
    deleteShapes: (
      state,
      action: {
        payload: DeletedShapeProps;
      },
    ) => {
      // Updated if delete "Shape" is "Arrow", "Rectangle", "Ellipse" ...
      Object.entries(action.payload.updatedShapes).forEach(([id, props]) => {
        const shapeIndex = state.shapes.findIndex((s) => s._id === id);
        const shape = state.shapes[shapeIndex];
        const updatedValue: Partial<Arrow | ArrowSupportedShapes> = {};

        if (shape.type === "point arrow") {
          (updatedValue as Partial<Arrow>)["attachedShape"] =
            props as AttachedShape | null;
        } else {
          (updatedValue as Partial<ArrowSupportedShapes>)["arrowProps"] =
            props as ArrowProps[] | null;
        }

        state.shapes[shapeIndex] = {
          ...state.shapes[shapeIndex],
          ...updatedValue,
        } as Shape;
      });

      state.shapes = state.shapes.filter(
        (s) => !action.payload.deletedShapes.includes(s._id),
      );
      state.selectedShapesId = null;
    },
    handleSelectedIds: (
      state,
      action: {
        payload: { _id: string | string[]; purpose?: SelectionPurpose } | null;
      },
    ) => {
      const { _id = "", purpose = "DEFAULT" } = action?.payload || {};
      const previousIds = state.selectedShapesId?._id || null;
      let id;

      if (!action?.payload) {
        state.selectedShapesId = null;
        return;
      }

      if (previousIds && Array.isArray(_id)) {
        const prevId = Array.isArray(previousIds) ? previousIds : [previousIds];
        id = [...prevId, ..._id];
      } else {
        id = _id;
      }

      state.selectedShapesId = {
        _id: id as string | string[],
        purpose,
      };
    },
    setSelectedShapeToAddArrow: (
      state,
      action: {
        payload: ArrowProps | null;
      },
    ) => {
      if (!action.payload) {
        state.selectedShapeToAddArrow = null;
      } else {
        state.selectedShapeToAddArrow = action.payload;
      }
    },
  },
});

export const {
  changeActiveTool,
  changeToolBarPropertiesValue,
  changeToolBarProperties,
  setShapes,
  handleSelectedIds,
  updateExistingShapes,
  deleteShapes,
  setSelectedShapeToAddArrow,
} = appSlice.actions;

export default appSlice.reducer;
