import { useRef } from "react";
import useOnClickOutside from "use-onclickoutside";
import {
  IoArrowDownCircleSharp,
  IoCheckmarkCircleSharp,
  IoPauseCircleSharp,
  IoSettingsSharp,
} from "react-icons/io5";

import { getIconSize } from "../lib/util";
import logo from "../assets/velcro.svg";

const Section = (props) => {
  return (
    <p className="px-3 py-1 text-xs text-gray-400 bg-gray-600 border-b border-gray-700">
      {props.sectionName}
    </p>
  );
};

const Sidebar = (props) => {
  const MENU_STYLE =
    "flex items-center w-full h-12 px-2 text-sm font-custom text-gray-300 cursor-pointer justify-items-start hover:bg-gray-600 border-b border-gray-700";

  const ref = useRef(null);
  useOnClickOutside(ref, () => props.closeBar());

  const getMenuStyle = (view) => {
    return MENU_STYLE + (view === props.selected ? " bg-gray-600" : "");
  };

  return (
    <div
      ref={ref}
      className={
        "fixed z-10 h-full overflow-auto bg-gray-700 shadow-lg" +
        "transition duration-200 transform-gpu w-56 ease-in-out " +
        (props.open ? "translate-x-0" : "-translate-x-full md:translate-x-0")
      }
    >
      <div className="flex items-center justify-center bg-blue-500 h-14 md:h-12 transition-all duration-200">
        <img src={logo} className="h-8 mr-1" alt="Logo" />
        <p className="mr-3 text-2xl font-custom text-blue-50">VelcroUI</p>
      </div>
      <div>
        <Section sectionName="Tasks" />
        <div
          className={getMenuStyle("active")}
          onClick={() => {
            props.updateView("active");
            props.closeBar();
          }}
        >
          <IoArrowDownCircleSharp size={getIconSize()} className="w-8" />
          <p className="pl-2">
            Downloading
            {props.count.active > 0 ? " (" + props.count.active + ")" : ""}
          </p>
        </div>
        <div
          className={getMenuStyle("waiting")}
          onClick={() => {
            props.updateView("waiting");
            props.closeBar();
          }}
        >
          <IoPauseCircleSharp size={getIconSize()} className="w-8" />
          <p className="pl-2">
            Paused
            {props.count.waiting > 0 ? " (" + props.count.waiting + ")" : ""}
          </p>
        </div>
        <div
          className={getMenuStyle("stopped")}
          onClick={() => {
            props.updateView("stopped");
            props.closeBar();
          }}
        >
          <IoCheckmarkCircleSharp size={getIconSize()} className="w-8" />
          <p className="pl-2">
            Finished
            {props.count.stopped > 0 ? " (" + props.count.stopped + ")" : ""}
          </p>
        </div>
      </div>
      <div>
        <Section sectionName="Settings" />
        <div
          className={getMenuStyle("settings")}
          onClick={() => {
            props.updateView("settings");
            props.closeBar();
          }}
        >
          <IoSettingsSharp size={getIconSize() - 3} className="w-8" />
          <p className="pl-2">Settings</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
