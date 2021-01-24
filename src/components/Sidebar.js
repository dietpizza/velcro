import { useEffect, useRef, useState } from "react";
import useOnClickOutside from "use-onclickoutside";
import {
  IoArrowDownCircleSharp,
  IoCheckmarkCircleSharp,
  IoPauseCircleSharp,
  IoSettingsSharp,
} from "react-icons/io5";

import { IconSize } from "../lib/util";
import logo from "../assets/velcro.svg";

import { Link } from "react-router-dom";

const Section = ({ sectionName }) => {
  return (
    <p className="px-3 py-1 text-xs text-gray-400 bg-gray-600 border-b border-gray-700">
      {sectionName}
    </p>
  );
};

const Sidebar = ({ closeSidebar, count, open }) => {
  const [view, setView] = useState("");
  const ref = useRef(null);

  const getMenuStyle = (path) => {
    return (
      "flex items-center w-full h-12 px-2 text-sm font-websafe text-gray-300 " +
      "cursor-pointer justify-items-start hover:bg-gray-600 " +
      "border-b border-gray-700" +
      (path === view ? " bg-gray-600" : "")
    );
  };
  const selectMenu = (path) => {
    closeSidebar();
    setView(path);
    //eslint-disable-next-line
  };

  useOnClickOutside(ref, () => closeSidebar());
  useEffect(() => {
    setView(window.location.pathname);
  }, []);

  return (
    <div
      ref={ref}
      className={
        "fixed z-10 h-full overflow-auto bg-gray-700 shadow-lg transition duration-200 transform-gpu w-56 ease-in-out " +
        (open ? "translate-x-0" : "-translate-x-full md:translate-x-0")
      }
    >
      <div className="flex items-center justify-center bg-blue-500 h-14 md:h-12 transition-all duration-200">
        <img src={logo} className="w-8 h-8 mr-1" alt="Logo" />
        <p className="mr-3 text-2xl font-websafe text-blue-50">VelcroUI</p>
      </div>
      <div>
        <Section sectionName="Tasks" />
        <Link to="/active">
          <div
            className={getMenuStyle("/active")}
            onClick={() => selectMenu("/active")}
          >
            <IoArrowDownCircleSharp size={IconSize} className="w-6 ml-1" />
            <p className="pl-2">
              Downloading
              {count.numActive > 0 ? " (" + count.numActive + ")" : ""}
            </p>
          </div>
        </Link>
        <Link to="/waiting">
          <div
            className={getMenuStyle("/waiting")}
            onClick={() => selectMenu("/waiting")}
          >
            <IoPauseCircleSharp size={IconSize} className="w-6 ml-1" />
            <p className="pl-2">
              Paused
              {count.numWaiting > 0 ? " (" + count.numWaiting + ")" : ""}
            </p>
          </div>
        </Link>
        <Link to="/stopped">
          <div
            className={getMenuStyle("/stopped")}
            onClick={() => selectMenu("/stopped")}
          >
            <IoCheckmarkCircleSharp size={IconSize} className="w-6 ml-1" />
            <p className="pl-2">
              Finished / Stopped
              {count.numStopped > 0 ? " (" + count.numStopped + ")" : ""}
            </p>
          </div>
        </Link>
      </div>
      <div>
        <Section sectionName="Settings" />
        <Link to="/settings">
          <div
            className={getMenuStyle("/settings")}
            onClick={() => selectMenu("/settings")}
          >
            <IoSettingsSharp size={IconSize - 3} className="w-6 ml-1" />
            <p className="pl-2">Settings</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
