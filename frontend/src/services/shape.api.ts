import { LOCALSTORAGE_KEY } from "@/lib/constant";
import { Shape } from "@/types/shapes";

const setInLocalStorage = (key: string, value: Shape | Shape[]) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getAllShapes = (): Promise<Shape[]> => {
  const shapes = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) ?? "[]");

  return shapes;
};

// export const getShape = (id: string): Promise<Shape> => {};

export const insertNewShape = async (shape: Shape) => {
  const prevShapes = await getAllShapes();

  setInLocalStorage(LOCALSTORAGE_KEY, [...prevShapes, shape]);
};

export const updateShapes = async (ids: string[], props: Partial<Shape>): Promise<void> => {
  const prevShapes = await getAllShapes();

  const updatedShapeProps = prevShapes.map((s) => {
    if (ids.includes(s._id)) {
      return {
        ...s,
        ...props,
      };
    }
    return s;
  });

  setInLocalStorage(LOCALSTORAGE_KEY, updatedShapeProps as Shape[]);
};

export const deleteShapesAPI = async (ids: string[]) => {
  const prevShapes = await getAllShapes();

  const filterRemovedShape = prevShapes.filter((s) => !ids.includes(s._id));

  setInLocalStorage(LOCALSTORAGE_KEY, filterRemovedShape);
};
