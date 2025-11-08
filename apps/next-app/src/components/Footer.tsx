import { BiRedo, BiUndo } from "react-icons/bi";

export const Footer = () => {
  return (
    <footer className="fixed bottom-0 w-full p-3 text-neutral-100 flex justify-between items-center">
      <div className="flex justify-center items-center bg-[#232329] p-1 rounded-md">
        {/* active bg-[#403E6A] */}
        <p
          title={"undo"}
          className="hover:bg-[#3a3a4a] p-2 rounded-md text-[15px] cursor-pointer"
        >
          <BiUndo size={18} />
        </p>
        <p
          title={"redo"}
          className="hover:bg-[#3a3a4a] p-2 rounded-md text-[15px] cursor-pointer"
        >
          <BiRedo size={18} />
        </p>
      </div>
    </footer>
  );
};
