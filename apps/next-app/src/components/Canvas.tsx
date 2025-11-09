import { CanvasEngine } from "@/canvas-engine";
import { toolType } from "@/utils/types";
import { useEffect, useRef } from "react";

interface CanvasProps {
  selectedTool: toolType;
  bgColor: string;
  theme: string | undefined;
}

export const Canvas = ({ selectedTool, bgColor, theme }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasEngine = useRef<CanvasEngine | null>(null);

  if (typeof window === "undefined" || !theme) {
    return null;
  }

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const newCanvasEngine = new CanvasEngine(
          selectedTool,
          theme,
          canvasRef.current,
          ctx
        );
        canvasEngine.current = newCanvasEngine;
      }
    }

    return () => {
      canvasEngine.current?.endFn();
    };
  }, [canvasRef.current, selectedTool]);

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
