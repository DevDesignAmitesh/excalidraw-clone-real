import { CanvasEngine } from "@/canvas-engine";
import { Shape, toolType } from "@/utils/types";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

interface CanvasProps {
  selectedTool: toolType;
  setSelectedTool: (e: toolType) => void;
  shapesDetails: Shape;
  bgColor: string;
  selectedShapeId: string | null;
  setSelectedShapeId: Dispatch<SetStateAction<string | null>>;
  theme: string | undefined;
}

export const Canvas = ({
  shapesDetails,
  selectedTool,
  bgColor,
  theme,
  setSelectedTool,
  selectedShapeId,
  setSelectedShapeId,
}: CanvasProps) => {
  if (typeof window === "undefined" || !theme) return null;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasEngine = useRef<CanvasEngine | null>(null);

  const [input, setInput] = useState<Shape | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const toggleSelectedShapeId = (inputId: string | null) => {
    setSelectedShapeId(inputId);
  };

  const themedColor = theme === "dark" ? "#fff" : "#000";

  // ✅ Focus AFTER textarea is rendered
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [input]); // run whenever we create a new text input

  const handleBlur = () => {
    if (!input || input.type !== "text" || input.input === "") {
      setInput(null);
      setSelectedTool("mouse");
      return;
    }
    canvasEngine.current?.createText({ inputShape: input, isNew: true });
    setInput(null);
    setSelectedTool("mouse");
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    canvasEngine.current = new CanvasEngine(
      shapesDetails,
      selectedTool,
      setSelectedTool,
      toggleSelectedShapeId,
      selectedShapeId,
      theme,
      themedColor,
      canvas,
      ctx
    );

    canvasEngine.current.startFn(); // important!

    return () => {
      canvasEngine.current?.endFn();
    };
  }, []); // only runs ONCE

  // Then update viewport by telling engine:
  useEffect(() => {
    canvasEngine.current?.updateEngine(
      shapesDetails,
      selectedTool,
      selectedShapeId,
      theme,
      themedColor
    );
    canvasEngine.current?.renderAllTheShapes();
  }, [selectedTool, selectedShapeId, shapesDetails, theme, themedColor]);

  useEffect(() => {
    console.log(selectedShapeId);
  }, [selectedShapeId]);

  const autosizeText = () => {
    if (!inputRef.current) return;
    inputRef.current.style.height = "auto";
    inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    inputRef.current.style.width = "auto";
    inputRef.current.style.width = inputRef.current.scrollWidth + "px";
  };

  useEffect(() => {
    autosizeText();
  }, [input]);

  return (
    <>
      <canvas
        ref={canvasRef}
        height={window.innerHeight}
        width={window.innerWidth}
        style={{ backgroundColor: bgColor }}
        onDoubleClick={(e) => {
          if (selectedShapeId !== null) return;
          const rect = canvasRef.current!.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          setSelectedTool("text");
          setInput({
            id: uuid(),
            type: "text",
            input: "",
            x,
            y,
            opacity: 100,
            color: themedColor,
            borderColor: themedColor,
            font: "serif",
            fontSize: "24",
          });
        }}
      />
      {input && input.type === "text" && (
        <textarea
          ref={inputRef}
          autoFocus
          className="absolute z-50 resize-none outline-none bg-transparent"
          style={{
            top: input.y,
            left: input.x,
            position: "absolute",
            transform: "translate(-50%, -50%)",

            // Typography from shape
            color: themedColor,
            fontFamily: input.font,
            fontSize: `${input.fontSize}px`,
            lineHeight: "1.2",

            // Auto sizing tricks
            overflow: "hidden",
            whiteSpace: "pre-wrap",
            minWidth: "20px",
            minHeight: "10px",

            // Remove default ui
            border: "none",
            boxShadow: "none",
            padding: "0px",
            backgroundColor: "transparent",
          }}
          value={input.input}
          onChange={(e) => {
            setInput({ ...input, input: e.target.value });
            autosizeText();
          }}
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
