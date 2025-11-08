import { HeaderItems, toolType } from "@/utils/HeaderItems";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";

interface HeaderProps {
  handleLeftSideBar: () => void;
  handleRightSideBar: () => void;
}

export const Header = ({
  handleLeftSideBar,
  handleRightSideBar,
}: HeaderProps) => {
  const [selectedTool, setSelectedTool] = useState<toolType>("hand");

  return (
    <header className="fixed top-0 w-full p-4 flex text-neutral-100 justify-between items-start">
      <button
        onClick={handleLeftSideBar}
        className="p-3 cursor-pointer rounded-md bg-[#232329]"
      >
        <RxHamburgerMenu />
      </button>
      {/* active bg-[#403E6A] for tools */}
      <nav className="bg-[#232329] flex gap-2 p-2 rounded-xl">
        {HeaderItems.map((item, idx) => (
          <p
            key={item.label}
            onClick={() => setSelectedTool(item.label)}
            title={item.label}
            className={`${item.label === selectedTool ? "bg-[#403E6A]" : "hover:bg-[#3a3a4a]"} p-3 rounded-md text-[15px] cursor-pointer relative`}
          >
            {item.icon}
            <span className="absolute -bottom-0.5 right-1 text-[11px]">
              {idx + 1}
            </span>
          </p>
        ))}
      </nav>
      <button
        onClick={handleRightSideBar}
        className="px-3 cursor-pointer py-2 text-[14px] rounded-md bg-[#A8A5FF] text-neutral-700"
      >
        Share
      </button>
    </header>
  );
};
