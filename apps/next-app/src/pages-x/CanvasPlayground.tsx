"use client";

import { Canvas } from "@/components/Canvas";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeaderLeftBar } from "@/components/HeaderLeftBar";
import { HeaderRightBar } from "@/components/HeaderRightBar";
import { ToolSideBar } from "@/components/ToolSideBar";
import { toolType } from "@/utils/types";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

export const CanvasPlayground = () => {
  // getting the theme from next-themes
  const { theme } = useTheme();

  // for teacking the tool
  const [selectedTool, setSelectedTool] = useState<toolType>("hand");

  // for handling selectedShapeId
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);

  // for handling the bg color of the canvas
  const [bgColor, setBgColor] = useState<string>(
    theme === "dark" ? "#121212" : "#fff"
  );

  // for handling the right side bar
  const [rightSideBarOpen, setRightSideBarOpen] = useState<boolean>(false);
  const rightSideBarRef = useRef<HTMLDivElement>(null);

  // for handling the left side bar
  const [leftSideBarOpen, setLeftSideBarOpen] = useState<boolean>(false);
  const leftSideBarRef = useRef<HTMLDivElement>(null);

  const toggleLeftSideBar = () => {
    setLeftSideBarOpen((p) => !p);
  };

  const toggleRightSideBar = () => {
    setRightSideBarOpen((p) => !p);
  };

  // toggling bg color when theme changes
  useEffect(() => {
    const newBgTheme = theme === "dark" ? "#121212" : "#fff";
    setBgColor(newBgTheme);
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
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          handleLeftSideBar={toggleLeftSideBar}
          handleRightSideBar={toggleRightSideBar}
        />
        <Canvas
          setSelectedShapeId={setSelectedShapeId}
          selectedTool={selectedTool}
          bgColor={bgColor}
          theme={theme}
        />
        <Footer />
      </div>
      {leftSideBarOpen && (
        <HeaderLeftBar
          setBgColor={setBgColor}
          leftSideBarRef={leftSideBarRef}
        />
      )}
      {selectedTool !== "hand" &&
        selectedTool !== "img" &&
        selectedTool !== "mouse" &&
        selectedTool !== "eraser" && (
          <ToolSideBar
            selectedShapeId={selectedShapeId}
            selectedTool={selectedTool}
          />
        )}
      {rightSideBarOpen && <HeaderRightBar rightSideBarRef={rightSideBarRef} />}
    </>
  );
};
