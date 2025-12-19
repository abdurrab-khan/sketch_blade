import { Shapes, ShapeStyles } from "./shapes";

export interface UpdatingShapePayLoad {
  shapeId: string;
  shapeValue?: Partial<Omit<Shapes, "styleProperties">>;
  shapeStyle?: Partial<ShapeStyles>;
}
