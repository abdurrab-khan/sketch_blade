import { ArrowDirection, ArrowPosition, SelectionPurpose } from "./shapes";

export interface AxiosMutateProps {
  method: "post" | "put" | "delete";
  uri: string;
  data?: any;
}

export interface AxiosQueryProps {
  uri: string;
}

export interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: any;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface FourCoordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Proximity {
  shapeId: string | null;
  isNear: boolean;
  arrowProps: ArrowProps | null;
}

export interface ArrowProps {
  _id: string;
  x: number;
  y: number;
  arrowPosition: ArrowPosition;
  arrowDirection?: ArrowDirection;
}

export interface SelectedShapesId {
  _id: string[] | string;
  purpose?: SelectionPurpose;
}
