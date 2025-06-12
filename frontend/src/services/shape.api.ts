import { LOCALSTORAGE_KEY } from "@/lib/constant";
import { Shape } from "@/types/shapes";

export const getAllShapes = (): Promise<Shape[] | null> => {
  const shapes = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) ?? "[]");

  return shapes;
};

export const getShape = (id: string): Promise<Shape | null> => {};

export const insertNewShape = (shape: Shape) => {
  const prevShapes = getAllShapes() ?? [];

  localStorage.setItem(
    LOCALSTORAGE_KEY,
    JSON.stringify([...prevShapes, shape]),
  );
};

export const updateShapes = (ids: string[], props: Partial<Shape>) => {};

export const updateShape = (id: string, props: Partial<Shape>) => {};

export const deleteShapes = (ids: string[]) => {};

export const deleteShape = (id: string) => {};
