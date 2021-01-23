import {
  IoGrid,
  IoPlay,
  IoTrash,
  IoPause,
  IoMenuSharp,
  IoAddOutline,
  IoFunnel,
} from "react-icons/io5";

import { IconSize } from "../lib/util";

import { Link } from "react-router-dom";

const Divider = () => {
  return (
    <div className="w-0 h-6 border-r border-gray-300 border-solid md:h-5" />
  );
};

const Actionbar = (props) => {
  return (
    <div className="flex items-center w-full px-1 text-gray-500 shadow space-x-3 md:space-x-2 h-14 md:h-12 transition-all duration-200">
      <div className="flex items-center md:hidden" onClick={props.openSidebar}>
        <IoMenuSharp size={IconSize} className="ml-3 mr-4 cursor-pointer" />
        <Divider />
      </div>
      <Link to="/new">
        <div className="flex items-center pr-1 cursor-pointer space-x-1">
          <IoAddOutline size={IconSize + 2} />
          <p className="text-base md:text-sm">New</p>
        </div>
      </Link>
      <Divider />
      <div className="flex items-center justify-between space-x-2">
        <IoPause size={IconSize} className="cursor-pointer" />
        <IoPlay size={IconSize - 4} className="cursor-pointer" />
        <IoTrash size={IconSize - 5} className="cursor-pointer" />
      </div>
      <Divider />
      <div className="flex items-center justify-between pl-1 space-x-3 md:space-x-2">
        <IoGrid size={IconSize - 6} className="cursor-pointer" />
        <IoFunnel size={IconSize - 6} className="cursor-pointer" />
      </div>
    </div>
  );
};

export default Actionbar;
