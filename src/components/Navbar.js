import { Plus, Pause, Play, Trash, Grid } from "react-feather";

const Navbar = (props) => {
  const Divider = () => {
    return (
      <div className="w-0 h-5 mx-3 border-r border-gray-300 border-solid" />
    );
  };
  return (
    <div className="flex items-center w-full h-12 px-3 text-gray-600 bg-gray-100 shadow">
      <div
        className="flex items-center mr-1 cursor-pointer"
        onClick={props.openSidebar}
      >
        <Plus size={24} className="mr-1" />
        <p className="text-sm">Add</p>
      </div>
      <Divider />
      <div className="flex items-center justify-between w-24 md:w-20">
        <Pause size={24} className="cursor-pointer" />
        <Play size={22} className="cursor-pointer" />
        <Trash size={20} className="cursor-pointer" />
      </div>
      <Divider />
      <div className="flex items-center justify-between w-24 ml-1 md:w-20 md:ml-0">
        <Grid size={22} className="cursor-pointer" />
      </div>
    </div>
  );
};

export default Navbar;
