import { ReactElement } from "react";

export type toolType =
  | "hand"
  | "mouse"
  | "rectangle"
  | "circle"
  | "text"
  | "eraser"
  | "pencil"
  | "img";

export interface HeaderItemsProps {
  icon: ReactElement;
  label: toolType;
}

// Base types for shared properties
type BaseShape = {
  id: string;
  opacity: number;
  isSelected?: boolean;
};

type PositionedShape = BaseShape & {
  x?: number;
  y?: number;
};

// Rectangle shape
export type RectangleShape = PositionedShape & {
  type: "rectangle";
  width?: number;
  height?: number;
  bgColor: string;
  strokeColor: string;
  strokeStyle: "dashed" | "dotted" | "line";
  borderRadius: number;
};

// Circle shape
export type CircleShape = PositionedShape & {
  type: "circle";
  radius?: number;
  strokeColor: string;
  bgColor: string;
};

// Pencil / freehand path
export type PencilShape = BaseShape & {
  type: "pencil";
  path?: Array<{ x: number; y: number }>;
  strokeColor: string;
};

// Text shape
export type TextShape = PositionedShape & {
  type: "text";
  input: string;
  color: string;
  borderColor: string;
  font: string;
  fontSize: string;
};

// Image shape (optional addition)
export type ImageShape = PositionedShape & {
  type: "img";
  src: string;
  width: number;
  height: number;
};

// Union of all shape variants
export type Shape =
  | RectangleShape
  | CircleShape
  | PencilShape
  | TextShape
  | ImageShape;

export interface CanvasDetailsProps {
  bgColor: string;
  selectedTool: toolType;
}
