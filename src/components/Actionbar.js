import {
  IoGrid,
  IoPlay,
  IoTrash,
  IoPause,
  IoMenuSharp,
  IoAddOutline,
  IoFunnel,
} from "react-icons/io5";

import { getIconSize } from "../lib/util";

import { Link } from "react-router-dom";

const Divider = () => {
  return (
    <div className="w-0 h-6 border-r border-gray-300 border-solid md:h-5" />
  );
};

const Actionbar = ({ openSidebar, clearSelected }) => {
  return (
    <div className="z-20 flex items-center flex-shrink-0 w-full px-1 text-gray-500 shadow select-none space-x-3 md:space-x-2 h-14 md:h-12 transition-all duration-200">
      <div className="flex items-center md:hidden" onClick={openSidebar}>
        <IoMenuSharp
          size={getIconSize()}
          className="ml-3 mr-4 cursor-pointer hover:text-blue-500"
        />
        <Divider />
      </div>
      <Link to="/new" onClick={clearSelected}>
        <div className="flex items-center pr-1 cursor-pointer space-x-1 hover:text-blue-500">
          <IoAddOutline size={getIconSize() + 2} />
          <p className="text-base md:text-sm">New</p>
        </div>
      </Link>
      <Divider />
      <div className="flex items-center justify-between space-x-2">
        <IoPause
          size={getIconSize()}
          className="cursor-pointer hover:text-blue-500"
        />
        <IoPlay
          size={getIconSize() - 4}
          className="cursor-pointer hover:text-blue-500"
        />
        <IoTrash
          size={getIconSize() - 5}
          className="cursor-pointer hover:text-blue-500"
        />
      </div>
      <Divider />
      <div className="flex items-center justify-between pl-1 space-x-3 md:space-x-2">
        <IoGrid
          size={getIconSize() - 6}
          className="cursor-pointer hover:text-blue-500"
        />
        <IoFunnel
          size={getIconSize() - 6}
          className="cursor-pointer hover:text-blue-500"
        />
      </div>
    </div>
  );
};

export default Actionbar;
