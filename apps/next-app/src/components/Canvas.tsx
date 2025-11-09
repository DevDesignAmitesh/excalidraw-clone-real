import { toolType } from "@/utils/HeaderItems";
import { useRef } from "react";

interface CanvasProps {
  selectedTool: toolType;
  bgColor: string;
}

export const Canvas = ({ selectedTool, bgColor }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <canvas 
      ref={canvasRef} 
      height={window.innerHeight} 
      width={window.innerWidth} 
      style={{
        backgroundColor: bgColor,
      }}
    />
  );
};
