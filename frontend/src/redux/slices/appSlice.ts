import { createSlice } from "@reduxjs/toolkit";

// Utils
import { DeletedShapeProps } from "../../utils/ShapeUtils.ts";
import { getCombineShapeProps } from "../../utils/Tool.ts";

// Common
import { SelectionPurpose } from "../../types/shapes/common.ts";

// Types
import { ArrowProps, SelectedShapesId } from "../../types/index.ts";
import { Shape, UpdateShape } from "../../types/shapes/shape-union.ts";
import {
  ActiveTool,
  ToolBarProperties,
  ToolType,
} from "../../types/tools/tool.ts";
import { toolBarProperties } from "@/lib/constant.ts";

type AppState = {
  clerkId: string | null;
  shapes: Shape[];
  activeTool: ActiveTool;
  toolBarProperties: Partial<ToolBarProperties> | null;
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

      if (type) {
        state.toolBarProperties = toolBarProperties[type];
      } else {
        state.toolBarProperties = null;
      }
    },

    removeUpdateToolBarProperties: (state, action) => {
      const payload = action.payload;

      state.toolBarProperties = payload;
    },

    updateToolBarProperties: (state, action) => {
      const payload = action.payload;

      if (payload === null) {
        state.toolBarProperties = null;
      } else {
        state.toolBarProperties = {
          ...state.toolBarProperties,
          ...payload,
        };
      }
    },

    changeToolBarProperties: (state, action) => {
      const shapes = action.payload;

      if (!shapes || shapes.length === 0) {
        state.toolBarProperties = null;
        return;
      }

      state.toolBarProperties = getCombineShapeProps(shapes);
    },

    setShapes: (state, action) => {
      const shapes: Shape = action.payload;

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
              shapeId?: string;
              shapeIndex?: number;
              shapeValue: Partial<UpdateShape>;
            }
          | {
              shapeId: string;
              shapeValue: Partial<UpdateShape>;
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
          for (const key in update.shapeValue) {
            const k = key as keyof Partial<UpdateShape>;
            const updatedShapeValues: Record<string, unknown> = {};

            // Check where updatedShapeValue is object, which mean it is customProperties or customEdgeRadius.
            if (
              update.shapeValue[k] &&
              (k === "customEdgeRadius" || k === "customProperties")
            ) {
              if (k === "customEdgeRadius") {
                if (state.shapes[index].type === "point arrow") {
                  updatedShapeValues["tension"] =
                    update.shapeValue[k]["tension"];
                } else {
                  updatedShapeValues["cornerRadius"] =
                    update.shapeValue[k]["cornerRadius"];
                }
              } else if (k === "customProperties") {
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
            } as Shape;
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
            const key =
              state.shapes[shapeIndex].type === "point arrow"
                ? "attachedShape"
                : "arrowProps";

            state.shapes[shapeIndex] = {
              ...state.shapes[shapeIndex],
              [key]: props,
            } as Shape;
          }
        });
      }

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
