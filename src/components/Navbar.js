import { IoGrid, IoPlay, IoTrash } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { IoIosPause } from "react-icons/io";
import { getIconSize } from "../lib/IconUtil";

const Divider = () => {
  return <div className="w-0 h-5 mx-3 border-r border-gray-300 border-solid" />;
};

const Navbar = (props) => {
  return (
    <div className="flex items-center w-full h-12 px-3 text-gray-500 shadow">
      <div
        className="flex items-center mr-1 cursor-pointer"
        onClick={props.openSidebar}
      >
        <GoPlus size={getIconSize() - 2} className="mr-1" />
        <p className="text-base md:text-sm">New</p>
      </div>
      <Divider />
      <div className="flex items-center justify-between">
        <IoIosPause size={getIconSize() + 2} className="cursor-pointer mr-1" />
        <IoPlay size={getIconSize() - 2} className="mr-1 cursor-pointer" />
        <IoTrash size={getIconSize() - 4} className="cursor-pointer" />
      </div>
      <Divider />
      <div className="flex items-center justify-between w-24 ml-1 md:w-20 md:ml-0">
        <IoGrid size={getIconSize() - 4} className="cursor-pointer" />
      </div>
    </div>
  );
};

export default Navbar;
