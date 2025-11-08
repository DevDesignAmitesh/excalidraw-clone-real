"use client";

import { Canvas } from "@/components/Canvas";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeaderLeftBar } from "@/components/HeaderLeftBar";
import { HeaderRightBar } from "@/components/HeaderRightBar";
import { useEffect, useRef, useState } from "react";

export const CanvasPlayground = () => {
  // for handling the left side bar
  const [leftSideBarOpen, setLeftSideBarOpen] = useState<boolean>(false);
  const leftSideBarRef = useRef<HTMLDivElement>(null);

  const toggleLeftSideBar = () => {
    setLeftSideBarOpen((p) => !p);
  };

  // for handling the right side bar
  const [rightSideBarOpen, setRightSideBarOpen] = useState<boolean>(false);
  const rightSideBarRef = useRef<HTMLDivElement>(null);

  const toggleRightSideBar = () => {
    setRightSideBarOpen((p) => !p);
  };

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
      <div className="relative h-screen w-full bg-[#121212]">
        <Header
          handleLeftSideBar={toggleLeftSideBar}
          handleRightSideBar={toggleRightSideBar}
        />
        <Canvas />
        <Footer />
      </div>
      {leftSideBarOpen && <HeaderLeftBar leftSideBarRef={leftSideBarRef} />}
      {rightSideBarOpen && <HeaderRightBar rightSideBarRef={rightSideBarRef} />}
    </>
  );
};
