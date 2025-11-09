import { BiRedo, BiUndo } from "react-icons/bi";

export const Footer = () => {
  return (
    <footer className="fixed bottom-0 w-full p-3 dark:text-neutral-100 text-neutral-700 flex justify-between items-center">
      <div className="flex justify-center items-center dark:bg-[#232329] bg-[#ececf8] p-1 rounded-md">
        {/* active bg-[#403E6A] */}
        <p
          title={"undo"}
          className="dark:hover:bg-[#3a3a4a] hover:bg-neutral-300 p-2 rounded-md text-[15px] cursor-pointer"
        >
          <BiUndo size={18} />
        </p>
        <p
          title={"redo"}
          className="dark:hover:bg-[#3a3a4a] hover:bg-neutral-300 p-2 rounded-md text-[15px] cursor-pointer"
        >
          <BiRedo size={18} />
        </p>
      </div>
    </footer>
  );
};
