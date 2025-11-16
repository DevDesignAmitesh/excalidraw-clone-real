"use client";

import { Canvas } from "@/components/Canvas";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeaderLeftBar } from "@/components/HeaderLeftBar";
import { HeaderRightBar } from "@/components/HeaderRightBar";
import { ToolSideBar } from "@/components/ToolSideBar";
import { CanvasDetailsProps, Shape } from "@/utils/types";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

export const CanvasPlayground = () => {
  // getting the theme from next-themes
  const { theme } = useTheme();

  // for handling selectedShapeId
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);

  // for handling the right side bar
  const [rightSideBarOpen, setRightSideBarOpen] = useState<boolean>(false);
  const rightSideBarRef = useRef<HTMLDivElement>(null);

  // for handling the left side bar
  const [leftSideBarOpen, setLeftSideBarOpen] = useState<boolean>(false);
  const leftSideBarRef = useRef<HTMLDivElement>(null);

  const themedColor = theme === "dark" ? "#fff" : "#000";

  const [canvasDetails, setCanvasDetails] = useState<CanvasDetailsProps>({
    bgColor: theme === "dark" ? "#121212" : "#fff",
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

  // toggling bg color when theme changes
  useEffect(() => {
    const newBgTheme = theme === "dark" ? "#121212" : "#fff";
    setCanvasDetails((p) => ({ ...p, bgColor: newBgTheme }));
  }, [theme]);

  useEffect(() => {
    console.log(shapesDetails);
  }, [shapesDetails]);

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

    const handleCloseRightSideBar = (event: globalThis.MouseEvent) => {
      const target = event.target as Node | null;
      if (
        rightSideBarOpen &&
        rightSideBarRef.current &&
        !rightSideBarRef.current.contains(target)
      ) {
        setRightSideBarOpen(false);
      }
    };

    const handleCloseSideBarWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLeftSideBarOpen(false);
        setRightSideBarOpen(false);
      }
    };

    window.addEventListener("mousedown", handleCloseLeftSideBar);
    window.addEventListener("mousedown", handleCloseRightSideBar);
    window.addEventListener("keydown", handleCloseSideBarWithEscape);

    return () => {
      window.removeEventListener("mousedown", handleCloseLeftSideBar);
      window.removeEventListener("mousedown", handleCloseRightSideBar);
      window.removeEventListener("keydown", handleCloseSideBarWithEscape);
    };
  }, [leftSideBarOpen, rightSideBarOpen]);
  return (
    <>
      <div className="relative h-screen w-full">
        <Header
          selectedTool={canvasDetails.selectedTool}
          setSelectedTool={(e) => {
            setCanvasDetails({ ...canvasDetails, selectedTool: e });
            setShapesDetails({ ...shapesDetails, type: e as any });
          }}
          handleLeftSideBar={toggleLeftSideBar}
          handleRightSideBar={toggleRightSideBar}
        />
        <Canvas
          shapesDetails={shapesDetails}
          setSelectedShapeId={setSelectedShapeId}
          selectedShapeId={selectedShapeId}
          selectedTool={canvasDetails.selectedTool}
          bgColor={canvasDetails.bgColor}
          theme={theme}
        />
        <Footer />
      </div>
      {leftSideBarOpen && (
        <HeaderLeftBar
          setBgColor={(newBgColor) =>
            setCanvasDetails((p) => ({ ...p, bgColor: newBgColor }))
          }
          leftSideBarRef={leftSideBarRef}
        />
      )}
      {canvasDetails.selectedTool !== "hand" &&
        canvasDetails.selectedTool !== "img" &&
        canvasDetails.selectedTool !== "mouse" &&
        canvasDetails.selectedTool !== "eraser" && (
          <ToolSideBar
            selectedTool={canvasDetails.selectedTool}
            setShapesDetails={setShapesDetails}
          />
        )}
      {rightSideBarOpen && <HeaderRightBar rightSideBarRef={rightSideBarRef} />}
    </>
  );
};
