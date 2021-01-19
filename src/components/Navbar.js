import { IoGrid, IoPlay, IoTrash, IoPause } from "react-icons/io5";
import { GoPlus } from "react-icons/go";

import { getIconSize } from "../lib/util";

const Divider = () => {
  return <div className="w-0 h-5 mx-3 border-r border-gray-300 border-solid" />;
};

const Navbar = (props) => {
  return (
    <div className="flex items-center w-full h-14 md:h-12 px-4 md:px-3 text-gray-500 shadow">
      <div
        className="flex items-center mr-1 cursor-pointer"
        onClick={props.openSidebar}
      >
        <GoPlus size={getIconSize() - 2} className="mr-1" />
        <p className="text-base md:text-sm">New</p>
      </div>
      <Divider />
      <div className="flex items-center justify-between">
        <IoPause size={getIconSize() + 2} className="mr-3 cursor-pointer" />
        <IoPlay size={getIconSize() - 2} className="mr-3 cursor-pointer" />
        <IoTrash size={getIconSize() - 4} className="cursor-pointer" />
      </div>
      <Divider />
      <div className="flex items-center justify-between ml-1 ">
        <IoGrid size={getIconSize() - 4} className="cursor-pointer" />
      </div>
    </div>
  );
};

export default Navbar;
