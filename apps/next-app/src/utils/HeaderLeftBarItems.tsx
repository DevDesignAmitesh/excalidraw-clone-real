import { ReactElement } from "react";
import { CiExport, CiImport } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import { FiGithub } from "react-icons/fi";
import { IoShareSocialOutline } from "react-icons/io5";
import { LuUserPlus } from "react-icons/lu";
import { MdKeyboardCommandKey, MdOutlineDelete } from "react-icons/md";
import { SlSocialLinkedin } from "react-icons/sl";
import { TbLogout2 } from "react-icons/tb";

interface HeaderLeftBarItemsProps {
  icon: ReactElement;
  label: string;
  href?: string;
  shortCut?: string;
  onClick?: () => void;
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
    label: "github",
    icon: <FiGithub size={15} />,
    href: "https://github.com/DevDesignAmitesh/excalidraw-clone-real",
  },
  {
    label: "twitter / X",
    icon: <FaXTwitter size={15} />,
    href: "https://x.com/amitesh48256/",
  },
  {
    label: "linkedin",
    icon: <SlSocialLinkedin size={15} />,
    href: "https://www.linkedin.com/in/amitesh-singh-504b2b281/",
  },
];
