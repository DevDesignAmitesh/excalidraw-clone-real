import { CanvasEngine } from "@/canvas-engine";
import { toolType } from "@/utils/types";
import { useEffect, useRef, useState } from "react";

interface CanvasProps {
  selectedTool: toolType;
  setSelectedShapeId: (input: string | null) => void;
  bgColor: string;
  theme: string | undefined;
}

export const Canvas = ({
  selectedTool,
  bgColor,
  theme,
  setSelectedShapeId,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasEngine = useRef<CanvasEngine | null>(null);

  const [input, setInput] = useState<{
    x: number;
    y: number;
    input: string;
  } | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  if (typeof window === "undefined" || !theme) return null;

  // ✅ Focus AFTER textarea is rendered
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [input]); // run whenever we create a new text input

  const handleBlur = () => {
    if (!input) return;
    canvasEngine.current?.createText(input);
    setInput(null);
  };

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const newCanvasEngine = new CanvasEngine(
          selectedTool,
          theme,
          setSelectedShapeId,
          canvasRef.current,
          ctx
        );
        canvasEngine.current = newCanvasEngine;
      }
    }

    return () => {
      canvasEngine.current?.endFn();
    };
  }, [selectedTool, theme]);

  return (
    <>
      <canvas
        ref={canvasRef}
        height={window.innerHeight}
        width={window.innerWidth}
        style={{ backgroundColor: bgColor }}
        onClick={(e) => {
          if (selectedTool === "text") {
            setInput({
              input: "",
              x: e.clientX,
              y: e.clientY,
            });
          } else {
            setInput(null);
          }
        }}
      />

      {input && selectedTool === "text" && (
        <textarea
          ref={inputRef}
          className="absolute z-50 border rounded-md p-2 w-40"
          placeholder="Enter text"
          style={{
            top: input.y,
            left: input.x,
            color: theme === "dark" ? "#e5e5e5" : "#404040",
            borderColor: theme === "dark" ? "#e5e5e5" : "#404040",
            boxSizing: "content-box",
            position: "absolute",
            transform: "translate(-50%, -50%)",
          }}
          value={input.input}
          onChange={(e) => setInput({ ...input, input: e.target.value })}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleBlur();
            }
          }}
        />
      )}
    </>
  );
};
