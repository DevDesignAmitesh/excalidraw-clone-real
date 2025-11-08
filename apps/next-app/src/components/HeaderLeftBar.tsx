import { HeaderLeftBarItems } from "@/utils/HeaderLeftBarItems";
import Link from "next/link";
import { RefObject } from "react";
import { FiSun } from "react-icons/fi";
import { MdOutlineDarkMode } from "react-icons/md";

interface HeaderLefBarProps {
  leftSideBarRef: RefObject<HTMLDivElement | null>;
}

export const HeaderLeftBar = ({ leftSideBarRef }: HeaderLefBarProps) => {
  return (
    <div
      ref={leftSideBarRef}
      className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-200 bg-[#232329] 
      flex flex-col justify-start items-center rounded-md w-[230px] h-[530px]"
    >
      <div className="h-full overflow-y-auto w-full px-2">
        {HeaderLeftBarItems.map((item) => (
          <>
            {item.label === "github" && (
              <hr className="text-neutral-600 py-2" />
            )}
            {item.href ? (
              <Link
                key={item.label}
                target="_blank"
                href={item.href}
                className="flex justify-start rounded-md items-center gap-2 w-full py-3 hover:bg-[#3a3a4a] cursor-pointer px-3 text-xs font-semibold"
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
                className="flex justify-start rounded-md items-center gap-2 w-full py-3 hover:bg-[#3a3a4a] cursor-pointer px-3 text-xs font-semibold"
              >
                {item.icon}
                <span className="capitalize">{item.label}</span>
                {item.shortCut && (
                  <span className="text-xs font-semibold">
                    {item.shortCut}
                  </span>
                )}
              </p>
            )}
          </>
        ))}
      </div>

      <div className="h-[45%] border-neutral-500 border-t-2 w-full flex flex-col justify-start items-center p-3 gap-3">
        <div className="flex justify-between items-center w-full">
          <p className="text-sm capitalize">theme</p>
          <div className="flex justify-center items-center border rounded-md border-neutral-600">
            <MdOutlineDarkMode
              size={34}
              className="bg-[#232329] cursor-pointer hover:bg-[#3a3a4a] rounded-md p-2 text-neutral-200"
            />
            <FiSun
              size={34}
              className="bg-[#232329] cursor-pointer hover:bg-[#3a3a4a] rounded-md p-2 text-neutral-200"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center items-start w-full gap-2">
          <p className="text-sm capitalize">canvas background</p>
          <div className="flex justify-center items-center gap-2">
            {["#121212", "#161718", "#13171C", "#181605", "#1B1615"].map(
              (item) => (
                <p
                  key={item}
                  style={{
                    backgroundColor: item,
                  }}
                  className={`cursor-pointer hover:scale-[1.1] transition-all rounded-md p-2 text-neutral-200 h-8 w-8`}
                />
              )
            )}
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};
