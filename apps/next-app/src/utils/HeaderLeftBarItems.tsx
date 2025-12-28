import { ReactElement } from "react";
import { CiExport, CiImport } from "react-icons/ci";
import { FiGithub } from "react-icons/fi";
import { ImProfile } from "react-icons/im";
import { IoShareSocialOutline } from "react-icons/io5";
import { LuUserPlus } from "react-icons/lu";
import { MdKeyboardCommandKey, MdOutlineDelete } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";

interface HeaderLeftBarItemsProps {
  icon: ReactElement;
  label: string;
  href?: string;
  shortCut?: string;
}

export const HeaderLeftBarItems: HeaderLeftBarItemsProps[] = [
  {
    label: "command palette",
    shortCut: "ctrl + /",
    icon: <MdKeyboardCommandKey size={15} />,
  },
  {
    label: "clear canvas",
    icon: <MdOutlineDelete size={15} />,
  },
  {
    label: "export drawing",
    icon: <CiExport size={15} />,
  },
  {
    label: "import drawing",
    icon: <CiImport size={15} />,
  },
  {
    label: "live collaboration",
    icon: <IoShareSocialOutline size={15} />,
  },
  {
    label: "sign up",
    icon: <LuUserPlus size={15} />,
  },
  {
    label: "log out",
    icon: <TbLogout2 size={15} />,
  },
  {
    label: "code base",
    icon: <FiGithub size={15} />,
    href: "https://github.com/DevDesignAmitesh/excalidraw-clone-real",
  },
  {
    label: "my portfolio",
    icon: <ImProfile size={15} />,
  },
];
