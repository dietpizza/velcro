import { useRef } from "react";
import { ArrowDownCircle, PauseCircle, CheckCircle } from "react-feather";
import useOnClickOutside from "use-onclickoutside";
import {
  IoArrowDownCircle,
  IoCheckmarkCircle,
  IoPauseCircle,
} from "react-icons/io5";

import { getIconSize } from "../lib/IconUtil";
import logo from "../assets/velcro.svg";

const Sidebar = (props) => {
  const MENU_STYLE =
    "flex items-center w-full h-12 px-3 py-2 text-gray-300 cursor-pointer justify-items-start hover:bg-gray-600";

  const ref = useRef(null);
  useOnClickOutside(ref, () => props.closeBar());

  return (
    <div
      ref={ref}
      className={
        "fixed z-10 h-full overflow-auto bg-gray-700 shadow-lg " +
        "transition duration-200 transform-gpu w-56 ease-in-out " +
        (props.open ? "translate-x-0" : "-translate-x-full md:translate-x-0")
      }
    >
      <div className="flex items-center justify-center h-12 bg-blue-500">
        <img src={logo} className="h-8" alt="Logo" />
        <p className="pl-1 pr-4 text-2xl font-custom text-blue-50">VelcroUI</p>
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
          <IoArrowDownCircle size={getIconSize()} />
          <p className="pl-2 text-sm">Downloading</p>
        </div>
        <div
          className={MENU_STYLE}
          onClick={() => {
            props.updateView("waiting");
            props.closeBar();
          }}
        >
          <IoPauseCircle size={getIconSize()} />
          <p className="pl-2 text-sm">Paused</p>
        </div>
        <div
          className={MENU_STYLE}
          onClick={() => {
            props.updateView("stopped");
            props.closeBar();
          }}
        >
          <IoCheckmarkCircle size={getIconSize()} />
          <p className="pl-2 text-sm">Stopped / Finished</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
