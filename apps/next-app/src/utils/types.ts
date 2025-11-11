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
      strokeStyle: "dashed" | "dotted" | "line";
      borderRadius: number;
      opacity: number;
    }
  | {
      id: string;
      type: "circle";
      x: number;
      y: number;
      radius: number;
      strokeColor: string;
      bgColor: string;
      opacity: number;
    }
  | {
      id: string;
      type: "pencil";
      path: { x: number; y: number }[];
      strokeColor: string;
      opacity: number;
    }
  | {
      id: string;
      type: "text";
      x: number;
      y: number;
      input: string;
      color: string;
      borderColor: string;
      opacity: number;
      font: string;
      fontSize: string;
    };
