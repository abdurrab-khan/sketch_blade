import axios from "../api/axios";
import { Shape } from "../types/shapes";

export class ShapeApi {
  static SHAPE_KEY = "sketch_blade";

  static async getShapeById(shapeId: string): Promise<Shape> {}

  static async getAllShapes(): Promise<Shape[]> {}

  static async addNewShape(
    shape: Shape,
    isAuthenticated: boolean,
  ): Promise<void> {
    if (!shape.isAddable) return;
    const { isAddable, ...shapeWithoutIsAddable } = shape;

    if (isAuthenticated) {
      return;
    } else {
      const existingShapes = JSON.parse(
        localStorage.getItem(this.SHAPE_KEY) || "[]",
      );

      const updatedShapes = Array.isArray(existingShapes)
        ? [...existingShapes, shapeWithoutIsAddable]
        : [shapeWithoutIsAddable];

      localStorage.setItem(this.SHAPE_KEY, JSON.stringify(updatedShapes));
    }
  }

  static async updateShape(shapeId: string, shape: Shape): Promise<void> {}

  static async deleteShape(shapeId: string): Promise<void> {}
}
