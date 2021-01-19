import { useRef } from "react";
import useOnClickOutside from "use-onclickoutside";
import { IoMdArrowDown, IoMdCheckmark, IoMdPause } from "react-icons/io";
import { FcBiomass } from "react-icons/fc";

import { getIconSize } from "../lib/util";

const Sidebar = (props) => {
  const MENU_STYLE =
    "flex items-center w-full h-12 px-3 py-2 text-gray-300 cursor-pointer justify-items-start hover:bg-gray-600";

  const ref = useRef(null);
  useOnClickOutside(ref, () => props.closeBar());

  return (
    <div
      ref={ref}
      className={
        "fixed z-10 h-full overflow-auto bg-gray-700 shadow-lg" +
        "transition duration-200 transform-gpu w-56 ease-in-out " +
        (props.open ? "translate-x-0" : "-translate-x-full md:translate-x-0")
      }
    >
      <div className="flex items-center justify-center bg-blue-500 h-14 md:h-12">
        <FcBiomass size={getIconSize() + 8} />
        <p className="mr-2 text-2xl font-custom text-blue-50">VelcroUI</p>
      </div>
      <p className="px-3 py-1 text-xs text-gray-400 bg-gray-600 border-b border-gray-700">
        Tasks
      </p>
      <div>
        <div
          className={MENU_STYLE}
          onClick={() => {
            props.updateView("active");
            props.closeBar();
          }}
        >
          <IoMdArrowDown size={getIconSize() - 1} className="w-8" />
          <p className="pl-2 text-sm">Downloading</p>
        </div>
        <div
          className={MENU_STYLE}
          onClick={() => {
            props.updateView("waiting");
            props.closeBar();
          }}
        >
          <IoMdPause size={getIconSize() - 2} className="w-8" />
          <p className="pl-2 text-sm">Paused</p>
        </div>
        <div
          className={MENU_STYLE}
          onClick={() => {
            props.updateView("stopped");
            props.closeBar();
          }}
        >
          <IoMdCheckmark size={getIconSize() - 2} className="w-8" />
          <p className="pl-2 text-sm">Stopped / Finished</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
