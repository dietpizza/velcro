import { IoGrid, IoPlay, IoTrash, IoPause, IoMenuSharp } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { AiOutlineSortAscending } from "react-icons/ai";

import { getIconSize } from "../lib/util";

const Divider = () => {
  return (
    <div className="w-0 h-6 border-r border-gray-300 border-solid md:h-5" />
  );
};

const Navbar = (props) => {
  return (
    <div className="flex items-center px-1 space-x-3 md:space-x-2 w-full text-gray-500 shadow h-14 md:h-12 transition-all duration-200">
      <div className="flex items-center md:hidden" onClick={props.openSidebar}>
        <IoMenuSharp size={getIconSize()} className="m-3" />
        <Divider />
      </div>
      <div className="flex items-center pr-1 cursor-pointer space-x-1">
        <GoPlus size={getIconSize() - 4} />
        <p className="text-base md:text-sm">New</p>
      </div>
      <Divider />
      <div className="flex items-center justify-between space-x-2">
        <IoPause size={getIconSize()} className="cursor-pointer" />
        <IoPlay size={getIconSize() - 4} className="cursor-pointer" />
        <IoTrash size={getIconSize() - 6} className="cursor-pointer" />
      </div>
      <Divider />
      <div className="flex items-center justify-between pl-1 space-x-2">
        <IoGrid size={getIconSize() - 6} className="cursor-pointer" />
        <AiOutlineSortAscending
          size={getIconSize()}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Navbar;
