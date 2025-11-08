import { RefObject } from "react";
import { IoIosLink } from "react-icons/io";
import { IoPlayOutline } from "react-icons/io5";

interface HeaderRightBarProps {
  rightSideBarRef: RefObject<HTMLDivElement | null>;
}

export const HeaderRightBar = ({ rightSideBarRef }: HeaderRightBarProps) => {
  return (
    <div
      ref={rightSideBarRef}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center w-[500px] h-[500px] rounded-md bg-[#232329] text-center p-5 gap-10"
    >
      <div className="flex flex-col justify-center items-center gap-4 w-full">
        <h3 className="text-[#A8A5FF] text-xl font-semibold">
          Live collaboration
        </h3>
        <p className="text-sm text-neutral-200">
          Invite people to collaborate on your drawing.
        </p>
        <p className="text-sm text-neutral-200">
          Don't worry, the session is end-to-end encrypted, and fully private.
          Not even our server can see what you draw.
        </p>
        <button className="px-4 py-3 rounded-md text-neutral-700 bg-[#A8A5FF] text-sm flex justify-center items-center gap-2 cursor-pointer hover:opacity-90">
          <IoPlayOutline size={20} />
          <span>Start Session</span>
        </button>
      </div>

      <div className="flex justify-center items-center w-full gap-4 text-neutral-200 text-sm">
        <hr className="w-full" />
        <span>OR</span>
        <hr className="w-full" />
      </div>

      <div className="flex flex-col justify-center items-center gap-4 w-full">
        <h3 className="text-[#A8A5FF] text-xl font-semibold">Shareable link</h3>
        <p className="text-sm text-neutral-200">Export as a read-only link. </p>
        <button className="px-4 py-3 rounded-md text-neutral-700 bg-[#A8A5FF] text-sm flex justify-center items-center gap-2 cursor-pointer hover:opacity-90">
          <IoIosLink size={20} />
          <span>export to link</span>
        </button>
      </div>
    </div>
  );
};
