import { HeaderLeftBarItems } from "@/utils/HeaderLeftBarItems";
import { useTheme } from "next-themes";
import Link from "next/link";
import { RefObject, useEffect } from "react";
import { FiSun } from "react-icons/fi";
import { MdOutlineDarkMode } from "react-icons/md";

interface HeaderLefBarProps {
  leftSideBarRef: RefObject<HTMLDivElement | null>;
  setBgColor: (input: string) => void;
}

const softerBackgrounds = [
  "#CFCFCF",
  "#BDBFC2",
  "#AEB0B4",
  "#BEBBAA",
  "#C2BBB8",
];

const darkerBackrounds = [
  "#121212",
  "#161718",
  "#13171C",
  "#181605",
  "#1B1615",
];

export const HeaderLeftBar = ({
  leftSideBarRef,
  setBgColor,
}: HeaderLefBarProps) => {
  const { setTheme, theme } = useTheme();

  // just to ensure that theme is not empty on the first render
  useEffect(() => {
    const storedTheme = localStorage.theme || "light";
    document.documentElement.classList.add(storedTheme);
    setTheme(storedTheme);
  }, []);

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

  return (
    <div
      ref={leftSideBarRef}
      className="absolute left-5 top-1/2 -translate-y-1/2 dark:text-neutral-200 text-neutral-700 dark:bg-[#232329] bg-[#ececf8] z-500
      flex flex-col justify-start items-center rounded-md w-[230px] h-[530px]"
    >
      <div className="h-full overflow-y-auto w-full px-2">
        {HeaderLeftBarItems.map((item) => (
          <>
            {item.label === "github" && (
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
                key={item.label}
                style={{
                  color: item.shortCut && "#5a54c4",
                }}
                className="flex justify-start rounded-md items-center gap-2 w-full py-3 dark:hover:bg-[#3a3a4a] hover:bg-neutral-100 cursor-pointer px-3 text-xs font-medium"
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
          <div className="flex justify-center items-center border rounded-md border-neutral-600">
            <MdOutlineDarkMode
              onClick={toggleThemeToDark}
              size={34}
              className={`cursor-pointer rounded-md p-2`}
            />
            <FiSun
              onClick={toggleThemeToLight}
              size={34}
              className={`cursor-pointer rounded-md p-2`}
            />
          </div>
        </div>
        <div className="flex flex-col justify-center items-start w-full gap-2">
          <p className="text-sm capitalize">canvas background</p>
          <div className="flex justify-center items-center gap-2">
            {(theme === "light" ? softerBackgrounds : darkerBackrounds).map(
              (item) => (
                <p
                  onClick={() => setBgColor(item)}
                  key={item}
                  style={{
                    backgroundColor: item,
                  }}
                  className={`cursor-pointer hover:scale-[1.1] transition-all rounded-md p-2 text-neutral-200 h-8 w-8`}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
