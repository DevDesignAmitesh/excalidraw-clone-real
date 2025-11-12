import { CanvasEngine } from "@/canvas-engine";
import { Shape, toolType } from "@/utils/types";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

interface CanvasProps {
  selectedTool: toolType;
  shapesDetails: Shape;
  setSelectedShapeId: (input: string | null) => void;
  selectedShapeId: string | null;
  bgColor: string;
  theme: string | undefined;
}

export const Canvas = ({
  shapesDetails,
  selectedTool,
  bgColor,
  theme,
  setSelectedShapeId,
  selectedShapeId,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasEngine = useRef<CanvasEngine | null>(null);

  const [input, setInput] = useState<Shape | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  if (typeof window === "undefined" || !theme) return null;

  const themedColor = theme === "dark" ? "#fff" : "#000";

  // ✅ Focus AFTER textarea is rendered
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [input]); // run whenever we create a new text input

  const handleBlur = () => {
    if (!input) return;
    canvasEngine.current?.createText({ inputShape: input, isNew: true });
    setInput(null);
  };

  useEffect(() => {
    console.log("am i running?");
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        console.log("is this running?");
        const newCanvasEngine = new CanvasEngine(
          shapesDetails,
          selectedTool,
          theme,
          themedColor,
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
  }, [
    selectedTool,
    theme,
    themedColor,
    shapesDetails,
    canvasRef,
    selectedShapeId,
  ]);

  return (
    <>
      <canvas
        ref={canvasRef}
        height={window.innerHeight}
        width={window.innerWidth}
        style={{ backgroundColor: bgColor }}
        onClick={(e) => {
          if (input?.type === "text") {
            setInput({
              id: uuid(),
              type: "text",
              input: "",
              x: e.clientX,
              y: e.clientY,
              opacity: 100,
              color: themedColor,
              borderColor: themedColor,
              font: "serif",
              fontSize: "24px",
            });
          } else {
            setInput(null);
          }
        }}
      />
      {input && input.type === "text" && (
        <textarea
          ref={inputRef}
          className="absolute z-50 border rounded-md p-2 w-40"
          placeholder="Enter text"
          style={{
            top: input.y,
            left: input.x,
            color: input.color,
            borderColor: input.borderColor,
            boxSizing: "content-box",
            position: "absolute",
            transform: "translate(-50%, -50%)",
            fontFamily: input.font,
            fontSize: input.fontSize,
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
