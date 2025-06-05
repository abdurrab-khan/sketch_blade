import { Shape } from "../../types";

function updateShape(
  id: string,
  shapeProperties: Partial<Shape>,
): Shape[] | null {
  const shapes = getAllShapes();

  if (!shapes) return null;

  const updatedShape = shapes?.map((shape) => {
    if (shape.id === id) {
      return { ...shape, ...shapeProperties };
    } else {
      return shape;
    }
  });

  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(updatedShape));
  return updatedShape || null;
}

function createNewShape(shapeProperties: Shape) {
  if (!shapeProperties.isAddable) return null;

  const previousShapes = getAllShapes() || [];

  delete shapeProperties.isAddable;
  previousShapes.push(shapeProperties);

  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(previousShapes));
}

function getAllShapes(): Shape[] | null {
  const shapes = localStorage.getItem(LOCALSTORAGE_KEY);

  if (!shapes) return null;

  return JSON.parse(shapes || "[]") as Shape[];
}

function deleteShape(ids: string[]) {
  if (!ids || ids?.length <= 0) return;

  const previousShapes = getAllShapes();

  const filteredShapes = previousShapes?.filter(
    (shape) => !ids.includes(shape.id),
  );

  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(filteredShapes));
}

export { updateShape, createNewShape, getAllShapes, deleteShape };
