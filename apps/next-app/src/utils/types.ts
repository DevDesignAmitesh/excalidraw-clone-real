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
export type Shape =
  | {
      id: string;
      type: "rectangle";
      x: number;
      y: number;
      width: number;
      height: number;
      bgColor: string;
      strokeColor: string;
      strokeStyle: string;
      borderRadius: string;
    }
  | {
      id: string;
      type: "circle";
      x: number;
      y: number;
      radius: number;
    }
  | {
      id: string;
      type: "pencil";
      path: { x: number; y: number }[];
    }
  | {
      id: string;
      type: "text";
      x: number;
      y: number;
      input: string;
    };
