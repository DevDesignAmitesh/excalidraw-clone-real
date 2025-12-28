import { HeaderLeftBarItems } from "@/utils/HeaderLeftBarItems";
import { useTheme } from "next-themes";
import Link from "next/link";
import { RefObject } from "react";
import { FiSun } from "react-icons/fi";
import { MdOutlineDarkMode } from "react-icons/md";

interface HeaderLefBarProps {
  leftSideBarRef: RefObject<HTMLDivElement | null>;
  setBgColor: (input: string, idx: number) => void;
  bgColor: string;
  deleteCanvas: () => void;
}

export const softerBackgrounds = [
  "#fff",
  "#BDBFC2",
  "#AEB0B4",
  "#BEBBAA",
  "#C2BBB8",
];

export const darkerBackrounds = [
  "#121212",
  "#161718",
  "#13171C",
  "#181605",
  "#1B1615",
];

export const HeaderLeftBar = ({
  leftSideBarRef,
  setBgColor,
  bgColor,
  deleteCanvas,
}: HeaderLefBarProps) => {
  const { setTheme, theme } = useTheme();

  const toggleThemeToDark = () => {
    setTheme("dark");
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
    localStorage.theme = "dark";
  };

  const toggleThemeToLight = () => {
    setTheme("light");
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
    localStorage.theme = "light";
  };

  const handleExecutions = (label: string) => {
    if (label === "clear canvas") deleteCanvas();
  };

  return (
    <div
      ref={leftSideBarRef}
      className="absolute left-5 top-1/2 -translate-y-1/2 dark:text-neutral-200 text-neutral-700 dark:bg-[#232329] bg-[#ececf8] z-500
      flex flex-col justify-start items-center rounded-md w-[230px] h-[530px]"
    >
      <div className="h-full overflow-y-auto w-full px-2">
        {HeaderLeftBarItems.map((item) => (
          <>
            {item.label === "code base" && (
              <hr className="dark:text-neutral-600 text-neutral-400 py-2" />
            )}
            {item.href ? (
              <Link
                key={item.label}
                target="_blank"
                href={item.href}
                className="flex justify-start rounded-md items-center gap-2 w-full py-3 dark:hover:bg-[#3a3a4a] hover:bg-neutral-100 cursor-pointer px-3 text-xs font-medium"
              >
                {item.icon}
                <span className="capitalize">{item.label}</span>
                {item.shortCut && (
                  <span className="text-xs font-semibold">{item.shortCut}</span>
                )}
              </Link>
            ) : (
              <p
                onClick={() => handleExecutions(item.label)}
                key={item.label}
                className={`flex justify-start rounded-md items-center gap-2 w-full py-3 dark:hover:bg-[#3a3a4a] hover:bg-neutral-100 cursor-pointer px-3 text-xs font-medium ${item.shortCut && "dark:text-[#918de7] text-[#564efc]"}`}
              >
                {item.icon}
                <span className="capitalize">{item.label}</span>
                {item.shortCut && (
                  <span className="text-xs font-semibold">{item.shortCut}</span>
                )}
              </p>
            )}
          </>
        ))}
      </div>

      <div className="h-[45%] dark:border-neutral-500 border-neutral-300 border-t-2 w-full flex flex-col justify-start items-center p-3 gap-3">
        <div className="flex justify-between items-center w-full">
          <p className="text-sm capitalize">theme</p>
          <div className="flex justify-center items-center">
            <MdOutlineDarkMode
              onClick={toggleThemeToDark}
              size={34}
              className={`cursor-pointer rounded-md p-2 ${theme === "dark" && "bg-[#403E6A]"} `}
            />
            <FiSun
              onClick={toggleThemeToLight}
              size={34}
              className={`cursor-pointer rounded-md p-2 ${theme === "light" && "bg-[#bebef0]"}`}
            />
          </div>
        </div>
        <div className="flex flex-col justify-center items-start w-full gap-2">
          <p className="text-sm capitalize">canvas background</p>
          <div className="flex justify-center items-center gap-2">
            {(theme === "light" ? softerBackgrounds : darkerBackrounds).map(
              (item, idx) => (
                <p
                  onClick={() => setBgColor(item, idx)}
                  key={item}
                  style={{
                    backgroundColor: item,
                  }}
                  className={`cursor-pointer hover:scale-[1.1] transition-all rounded-md p-2 text-neutral-200 h-8 w-8 ${bgColor === item ? "scale-85" : "scale-100"}`}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
