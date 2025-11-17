import { Dispatch, SetStateAction } from "react";
import { IoIosLink } from "react-icons/io";
import { IoPlayOutline } from "react-icons/io5";

interface HeaderRightBarProps {
  setRightSideBarOpen: Dispatch<SetStateAction<boolean>>;
}

export const HeaderRightBar = ({
  setRightSideBarOpen,
}: HeaderRightBarProps) => {
  return (
    <div
      onClick={() => setRightSideBarOpen(false)}
      className="absolute inset-0 z-50 flex justify-center items-center bg-black/10"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center w-[500px] h-[500px] rounded-md dark:bg-[#232329] bg-neutral-50 text-center p-5 gap-10"
      >
        <div className="flex flex-col justify-center items-center gap-4 w-full">
          <h3 className="dark:text-[#A8A5FF] text-[#7470dc] text-xl font-semibold">
            Live collaboration
          </h3>
          <p className="text-sm dark:text-neutral-200 text-neutral-700">
            Invite people to collaborate on your drawing.
          </p>
          <p className="text-sm dark:text-neutral-200 text-neutral-700">
            Don't worry, the session is end-to-end encrypted, and fully private.
            Not even our server can see what you draw.
          </p>
          <button
            className="px-4 py-3 rounded-md dark:text-neutral-700 text-neutral-200 dark:bg-[#A8A5FF] 
        bg-[#7470dc] text-sm flex justify-center items-center gap-2 cursor-pointer hover:opacity-90"
          >
            <IoPlayOutline size={20} />
            <span>Start Session</span>
          </button>
        </div>

        <div className="flex justify-center items-center w-full gap-4 dark:text-neutral-200 text-neutral-500 text-sm">
          <hr className="w-full" />
          <span>OR</span>
          <hr className="w-full" />
        </div>

        <div className="flex flex-col justify-center items-center gap-4 w-full">
          <h3 className="dark:text-[#A8A5FF] text-[#7470dc] text-xl font-semibold">
            Shareable link
          </h3>
          <p className="text-sm dark:text-neutral-200 text-neutral-700">
            Export as a read-only link.{" "}
          </p>
          <button
            className="px-4 py-3 rounded-md dark:text-neutral-700 text-neutral-200 dark:bg-[#A8A5FF] 
        bg-[#7470dc] text-sm flex justify-center items-center gap-2 cursor-pointer hover:opacity-90"
          >
            <IoIosLink size={20} />
            <span>export to link</span>
          </button>
        </div>
      </div>
    </div>
  );
};
