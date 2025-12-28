"use client";

import { CanvasEngine } from "@/canvas-engine";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import {
  darkerBackrounds,
  HeaderLeftBar,
  softerBackgrounds,
} from "@/components/HeaderLeftBar";
import { HeaderRightBar } from "@/components/HeaderRightBar";
import { ToolSideBar } from "@/components/ToolSideBar";
import { CanvasDetailsProps, Shape } from "@/utils/types";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

const BG_COLOR_IDX = "bg_color_idx";

export const CanvasPlayground = () => {
  if (typeof window === "undefined") return;

  // getting the theme from next-themes
  const { theme, setTheme } = useTheme();

  const canvasEngine = useRef<CanvasEngine | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [input, setInput] = useState<Shape | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // for handling selectedShapeId
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);

  // for handling the right side bar
  const [rightSideBarOpen, setRightSideBarOpen] = useState<boolean>(false);

  // for handling the left side bar
  const [leftSideBarOpen, setLeftSideBarOpen] = useState<boolean>(false);
  const leftSideBarRef = useRef<HTMLDivElement>(null);

  const themedColor = theme === "dark" ? "#fff" : "#000";

  const LOCAL_SOTRAGE_BG_COLOR_IDX = localStorage.getItem(BG_COLOR_IDX);

  // this is the fn for gettig the bgcolor on the same index as excaildraw doooo
  const LOCAL_STORAGE_BG_COLOR = () => {
    const INDEX = JSON.parse(LOCAL_SOTRAGE_BG_COLOR_IDX ?? "100000");

    let newBgColor: string = theme === "dark" ? "#fff" : "#000";

    if (theme === "dark" && LOCAL_SOTRAGE_BG_COLOR_IDX) {
      const bgColor = darkerBackrounds.find((_, idx) => idx === INDEX);
      if (bgColor) newBgColor = bgColor;
    } else if (theme === "light" && LOCAL_SOTRAGE_BG_COLOR_IDX) {
      const bgColor = softerBackgrounds.find((_, idx) => idx === INDEX);
      if (bgColor) newBgColor = bgColor;
    }

    return newBgColor;
  };

  const [canvasDetails, setCanvasDetails] = useState<CanvasDetailsProps>({
    bgColor: LOCAL_STORAGE_BG_COLOR(),
    selectedTool: "hand",
  });

  const [shapesDetails, setShapesDetails] = useState<Shape>({
    type: canvasDetails.selectedTool as any,
    bgColor: "",
    borderColor: themedColor,
    borderRadius: 0,
    color: themedColor,
    font: "serif",
    fontSize: "20px",
    id: uuid(),
    input: "",
    opacity: 1.0,
    radius: 1,
    strokeColor: themedColor,
    strokeStyle: "line",
  });

  const toggleLeftSideBar = () => {
    setLeftSideBarOpen((p) => !p);
  };

  const toggleRightSideBar = () => {
    setRightSideBarOpen((p) => !p);
  };

  const toggleSelectedShapeId = (inputId: string | null) => {
    setSelectedShapeId(inputId);
  };

  const handleBlur = () => {
    if (!input || input.type !== "text" || input.input === "") {
      setInput(null);
      setCanvasDetails((p) => ({ ...p, selectedTool: "mouse" }));
      return;
    }
    canvasEngine.current?.createText({ inputShape: input, isNew: true });
    setInput(null);
    setCanvasDetails((p) => ({ ...p, selectedTool: "mouse" }));
  };

  const autosizeText = () => {
    if (!inputRef.current) return;
    inputRef.current.style.height = "auto";
    inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    inputRef.current.style.width = "auto";
    inputRef.current.style.width = inputRef.current.scrollWidth + "px";
  };

  const deleteCanvas = () => {
    console.log("is delete running???");
    canvasEngine.current?.clearCanvas();
  };

  useEffect(() => {
    autosizeText();
  }, [input]);

  // toggling bg color when theme changes
  useEffect(() => {
    let newBgTheme: string = "";

    if (
      canvasDetails.bgColor === "#121212" ||
      canvasDetails.bgColor === "#fff"
    ) {
      newBgTheme = theme === "dark" ? "#121212" : "#fff";
    } else {
      newBgTheme = LOCAL_STORAGE_BG_COLOR();
    }

    setCanvasDetails((p) => ({ ...p, bgColor: newBgTheme }));
  }, [theme]);

  useEffect(() => {
    const handleCloseLeftSideBar = (event: globalThis.MouseEvent) => {
      const target = event.target as Node | null;
      if (
        leftSideBarOpen &&
        leftSideBarRef.current &&
        !leftSideBarRef.current.contains(target)
      ) {
        setLeftSideBarOpen(false);
      }
    };

    const handleCloseLeftSideBarWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLeftSideBarOpen(false);
      }
    };

    const handleCloseRightSideBarWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setRightSideBarOpen(false);
      }
    };

    window.addEventListener("mousedown", handleCloseLeftSideBar);
    window.addEventListener("keydown", handleCloseLeftSideBarWithEscape);
    window.addEventListener("keydown", handleCloseRightSideBarWithEscape);

    return () => {
      window.removeEventListener("mousedown", handleCloseLeftSideBar);
      window.removeEventListener("keydown", handleCloseLeftSideBarWithEscape);
      window.removeEventListener("keydown", handleCloseRightSideBarWithEscape);
    };
  }, [leftSideBarOpen, rightSideBarOpen]);

  // just to ensure that theme is not empty on the first render
  useEffect(() => {
    const storedTheme = localStorage.theme || "light";
    document.documentElement.classList.add(storedTheme);
    setTheme(storedTheme);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    canvasEngine.current = new CanvasEngine(
      shapesDetails,
      canvasDetails.selectedTool,
      (e) => setCanvasDetails((p) => ({ ...p, selectedTool: e })),
      toggleSelectedShapeId,
      selectedShapeId,
      theme!,
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
      canvasDetails.selectedTool,
      selectedShapeId,
      theme!,
      themedColor
    );
    canvasEngine.current?.renderAllTheShapes();
  }, [
    canvasDetails.selectedTool,
    ,
    selectedShapeId,
    shapesDetails,
    theme,
    themedColor,
  ]);

  // Focus AFTER textarea is rendered
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [input]); // run whenever we create a new text input
  return (
    <>
      <div className="relative h-screen overflow-hidden w-full">
        <div className="relative h-full w-full">
          <Header
            selectedTool={canvasDetails.selectedTool}
            setSelectedTool={(e) => {
              setCanvasDetails({ ...canvasDetails, selectedTool: e });
              setShapesDetails({ ...shapesDetails, type: e as any });
            }}
            handleLeftSideBar={toggleLeftSideBar}
            handleRightSideBar={toggleRightSideBar}
          />
          <canvas
            className="z-10000"
            ref={canvasRef}
            height={window.innerHeight}
            width={window.innerWidth}
            style={{ backgroundColor: canvasDetails.bgColor }}
            onDoubleClick={(e) => {
              if (selectedShapeId !== null) return;
              const rect = canvasRef.current!.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              (setCanvasDetails((p) => ({ ...p, selectedTool: "text" })),
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
                }));
            }}
          />
          <Footer />
        </div>
        {leftSideBarOpen && (
          <HeaderLeftBar
            deleteCanvas={deleteCanvas}
            bgColor={canvasDetails.bgColor}
            setBgColor={(newBgColor, idx) => {
              setCanvasDetails((p) => ({ ...p, bgColor: newBgColor }));
              localStorage.setItem(BG_COLOR_IDX, JSON.stringify(idx));
            }}
            leftSideBarRef={leftSideBarRef}
          />
        )}
        {((canvasDetails.selectedTool !== "hand" &&
          canvasDetails.selectedTool !== "img" &&
          canvasDetails.selectedTool !== "mouse" &&
          canvasDetails.selectedTool !== "eraser") ||
          selectedShapeId !== null) && (
          <ToolSideBar
            selectedTool={canvasDetails.selectedTool}
            setShapesDetails={setShapesDetails}
          />
        )}
        {rightSideBarOpen && (
          <HeaderRightBar setRightSideBarOpen={setRightSideBarOpen} />
        )}
      </div>
      <>
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
    </>
  );
};
