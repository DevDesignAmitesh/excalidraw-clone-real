import type { ReactElement } from "react";
import { BsEraser } from "react-icons/bs";
import { FaRegCircle, FaRegHandPaper, FaRegSquare } from "react-icons/fa";
import { FiMousePointer } from "react-icons/fi";
import { ImTextColor } from "react-icons/im";
import { IoImagesOutline } from "react-icons/io5";

export type toolType =
  | "hand"
  | "mouse"
  | "rectangle"
  | "circle"
  | "text"
  | "eraser"
  | "img";

interface HeaderItemsProps {
  icon: ReactElement;
  label: toolType;
}

export const HeaderItems: HeaderItemsProps[] = [
  {
    label: "hand",
    icon: <FaRegHandPaper />,
  },
  {
    label: "mouse",
    icon: <FiMousePointer />,
  },
  {
    label: "rectangle",
    icon: <FaRegSquare />,
  },
  {
    label: "circle",
    icon: <FaRegCircle />,
  },
  {
    label: "text",
    icon: <ImTextColor />,
  },
  {
    label: "eraser",
    icon: <BsEraser />,
  },
  {
    label: "img",
    icon: <IoImagesOutline />,
  },
];
