import {
  IoArrowDownCircleSharp,
  IoCheckmarkCircleSharp,
  IoPauseCircleSharp,
  IoSettingsSharp,
} from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getIconSize } from "../lib/util";
import useOnClickOutside from "use-onclickoutside";
import logo from "../assets/velcro.svg";
import { useSelector, useDispatch } from "react-redux";
import { actions } from "../redux";

const Section = ({ sectionName }) => {
  return (
    <p className="px-3 py-1 text-xs text-gray-200 bg-gray-600 border-b border-gray-700">
      {sectionName}
    </p>
  );
};

const Sidebar = ({ count }) => {
  const dispatch = useDispatch();
  const [view, setView] = useState("");
  const sidebarStatus = useSelector((state) => state.sidebarStatus);
  const ref = useRef(null);
  const getMenuStyle = (path) => {
    return (
      "flex items-center w-full h-12 px-2 font-websafe text-sm text-gray-300 " +
      "cursor-pointer justify-items-start hover:bg-gray-600 " +
      "border-b border-gray-700" +
      (path === view ? " bg-gray-600" : "")
    );
  };
  const selectMenu = (path) => {
    dispatch({ type: actions.closeSidebar });
    if (view !== path) {
      dispatch({ type: actions.setSelected, payload: [] });
    }
    setView(path);
  };

  useOnClickOutside(ref, () => dispatch({ type: actions.closeSidebar }));
  useEffect(() => {
    const path = window.location.pathname;
    if (view !== path) setView(path);
  });

  return (
    <div
      ref={ref}
      className={
        "fixed z-30 h-full overflow-auto bg-gray-700 transition duration-200 transform-gpu w-56 ease-in-out select-none shadow " +
        (sidebarStatus ? "translate-x-0" : "-translate-x-full md:translate-x-0")
      }
    >
      <div className="flex items-center justify-center bg-blue-600 h-14 md:h-12 transition-all duration-200">
        <img src={logo} className="w-8 h-8 mr-1" alt="Logo" />
        <p className="mr-3 text-2xl text-white font-websafe">VelcroUI</p>
      </div>
      <div>
        <Section sectionName="Tasks" />
        <Link to="/active">
          <div
            className={getMenuStyle("/active")}
            onClick={() => selectMenu("/active")}
          >
            <IoArrowDownCircleSharp size={getIconSize()} className="ml-1" />
            <p className="pl-2">
              Downloading
              {count.numActive > 0 ? ` (${count.numActive})` : ""}
            </p>
          </div>
        </Link>
        <Link to="/waiting">
          <div
            className={getMenuStyle("/waiting")}
            onClick={() => selectMenu("/waiting")}
          >
            <IoPauseCircleSharp size={getIconSize()} className="ml-1" />
            <p className="pl-2">
              Paused
              {count.numWaiting > 0 ? ` (${count.numWaiting})` : ""}
            </p>
          </div>
        </Link>
        <Link to="/stopped">
          <div
            className={getMenuStyle("/stopped")}
            onClick={() => selectMenu("/stopped")}
          >
            <IoCheckmarkCircleSharp size={getIconSize()} className="ml-1" />
            <p className="pl-2">
              Finished / Stopped
              {count.numStopped > 0 ? ` (${count.numStopped})` : ""}
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
            <IoSettingsSharp size={getIconSize() - 3} className="ml-1" />
            <p className="pl-2">Settings</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
