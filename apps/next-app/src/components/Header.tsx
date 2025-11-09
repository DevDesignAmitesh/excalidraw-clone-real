import { HeaderItems, toolType } from "@/utils/HeaderItems";
import { RxHamburgerMenu } from "react-icons/rx";

interface HeaderProps {
  handleLeftSideBar: () => void;
  handleRightSideBar: () => void;
  selectedTool: toolType;
  setSelectedTool: (input: toolType) => void;
}

export const Header = ({
  handleLeftSideBar,
  handleRightSideBar,
  selectedTool,
  setSelectedTool,
}: HeaderProps) => {
  return (
    <header className="fixed top-0 w-full p-4 flex dark:text-neutral-100 text-neutral-700 justify-between items-start">
      <button
        onClick={handleLeftSideBar}
        className="p-2.5 cursor-pointer rounded-lg dark:bg-[#232329] bg-[#ececf8]"
      >
        <RxHamburgerMenu />
      </button>
      {/* active bg-[#403E6A] for tools */}
      <nav className="dark:bg-[#232329] bg-white shadow-lg flex gap-2 p-2 rounded-xl">
        {HeaderItems.map((item, idx) => (
          <p
            key={item.label}
            onClick={() => setSelectedTool(item.label)}
            title={item.label}
            className={`${item.label === selectedTool ? "dark:bg-[#403E6A] bg-[#ececf8]" : "dark:hover:bg-[#3a3a4a] hover:bg-neutral-100"} p-3 rounded-md text-[15px] cursor-pointer relative`}
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
        className="px-3 cursor-pointer py-2 text-[14px] rounded-md dark:bg-[#A8A5FF]
         bg-[#6363f1] dark:text-neutral-700 text-neutral-100"
      >
        Share
      </button>
    </header>
  );
};
