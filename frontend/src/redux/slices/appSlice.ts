import { createSlice } from "@reduxjs/toolkit";

// Utils
import { DeletedShapeProps } from "../../utils/ShapeUtils.ts";
import { getCombineShapeProps } from "../../utils/Tool.ts";

// Common
import { ArrowProps, SelectionPurpose } from "../../types/shapes/common.ts";

// Types
import { ActiveTool } from "../../types/tools/tool.ts";
import { shapeStyleProperties } from "@/lib/constant.ts";
import { SelectedShapesId } from "@/types/index.ts";
import { CombineShapeStyle, ShapeStylePartial } from "@/types/shapes/style-properties.ts";
import { Shapes, ToolType } from "@/types/shapes/shapes.ts";

type AppState = {
  clerkId: string | null;
  shapes: Shapes[];
  activeTool: ActiveTool;
  shapeStyles: ShapeStylePartial | null;
  combineShapeStyles: CombineShapeStyle | null;
  selectedShapesId: SelectedShapesId | null;
  selectedShapeToAddArrow: ArrowProps | null;
};

const initialState: AppState = {
  clerkId: null,
  shapes: [],
  activeTool: {
    type: "cursor",
    isLocked: false,
  },
  shapeStyles: null,
  combineShapeStyles: null,
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

      if (type && type in shapeStyleProperties) {
        const k = type === "cursor" ? "text" : type;
        state.shapeStyles = shapeStyleProperties[k];
      } else {
        state.shapeStyles = null;
      }
    },

    removeUpdateToolBarProperties: (state, action) => {
      const payload = action.payload;

      state.shapeStyles = payload;
    },

    updateToolBarProperties: (state, action) => {
      const payload = action.payload;

      if (payload === null) {
        state.shapeStyles = null;
      } else {
        state.shapeStyles = {
          ...state.shapeStyles,
          ...payload,
        };
      }
    },

    changeToolBarProperties: (state, action) => {
      const shapes = action.payload;

      if (!shapes || shapes.length === 0) {
        state.combineShapeStyles = null;
        return;
      }

      state.combineShapeStyles = getCombineShapeProps(shapes);
    },

    setShapes: (state, action) => {
      const shapes: Shapes = action.payload;

      if (Array.isArray(shapes)) {
        if (state.shapes.length > 0) {
          state.shapes.concat(shapes);
        } else {
          state.shapes = shapes;
        }
      } else {
        state.shapes.push(shapes);
      }
    },

    updateExistingShapes: (
      state,
      action: {
        payload:
          | {
              shapeId: string;
              shapeValue: Partial<Shapes>;
            }
          | {
              shapeId: string;
              shapeValue: Partial<Shapes>;
            }[];
      },
    ) => {
      const updates = Array.isArray(action.payload) ? action.payload : [action.payload];

      updates.forEach((update) => {
        const index = state.shapes.findIndex((shape) => shape._id === update.shapeId);

        if (index !== -1) {
          for (const key in update.shapeValue) {
            const k = key as keyof Partial<Shapes>;
            const updatedShapeValues: Record<string, unknown> = {};

            if (update.shapeValue[k]) {
              if (k === "styleProperties") {
                updatedShapeValues[k] = {
                  ...state.shapes[index][k],
                  ...update.shapeValue[k],
                };
              }
            } else {
              updatedShapeValues[k] = update.shapeValue[k];
            }

            state.shapes[index] = {
              ...state.shapes[index],
              ...updatedShapeValues,
            } as Shapes;
          }
        }
      });
    },

    deleteShapes: (
      state,
      action: {
        payload: DeletedShapeProps;
      },
    ) => {
      const updatedShapeProps = Object.entries(action.payload?.updatedShapes);

      // Updated if delete "Shape" is "Arrow", "Rectangle", "Ellipse" ...
      if (updatedShapeProps.length > 0) {
        updatedShapeProps.forEach(([id, props]) => {
          const shapeIndex = state.shapes.findIndex((s) => s._id === id);

          if (shapeIndex !== -1) {
            const key = state.shapes[shapeIndex].type === "arrow" ? "attachedShape" : "arrowProps";

            state.shapes[shapeIndex] = {
              ...state.shapes[shapeIndex],
              [key]: props,
            } as Shapes;
          }
        });
      }

      state.shapes = state.shapes.filter((s) => !action.payload.deletedShapes.includes(s._id));
      state.selectedShapesId = null;
    },

    handleSelectedIds: (
      state,
      action: {
        payload: { _id: string | string[]; purpose?: SelectionPurpose } | null;
      },
    ) => {
      const { _id = "", purpose = "DEFAULT" } = action?.payload || {};

      if (!action?.payload) {
        state.selectedShapesId = null;
        return;
      }

      state.selectedShapesId = {
        _id: _id as string | string[],
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
  removeUpdateToolBarProperties,
  updateToolBarProperties,
  changeToolBarProperties,
  setShapes,
  handleSelectedIds,
  updateExistingShapes,
  deleteShapes,
  setSelectedShapeToAddArrow,
} = appSlice.actions;

export default appSlice.reducer;
