import {
  MdFileDownload,
  MdInfoOutline,
  MdSchedule,
  MdSettings,
} from "react-icons/md";
import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import { useGlobalState, setSidebar } from "../globalState";

import useOnClickOutside from "use-onclickoutside";

import logo from "../assets/velcro.svg";

const Section = ({ sectionName }) => {
  return (
    <p className="px-3 py-1 text-xs text-gray-200 bg-gray-600 border-b border-gray-700">
      {sectionName}
    </p>
  );
};

const Sidebar = () => {
  const iconStyle = "transition-all duration-200 ease-in-out w-10 pr-2";

  const path = useLocation().pathname;
  const [sidebarStatus] = useGlobalState("sidebarStatus");
  const [{ globalStat }] = useGlobalState("data");

  const getMenuStyle = (id) => {
    return (
      "flex items-center w-full h-12 px-2 font-websafe text-sm text-gray-300 " +
      "cursor-pointer justify-items-start hover:bg-gray-600 " +
      "border-b border-gray-700" +
      (id === path ? " bg-gray-600" : "")
    );
  };
  const ref = useRef(null);
  useOnClickOutside(ref, () => setSidebar(false));

  return (
    <div
      ref={ref}
      className={
        "fixed z-30 h-full overflow-auto bg-gray-700 transition duration-200 transform-gpu w-60 ease-in-out select-none shadow " +
        (sidebarStatus ? "translate-x-0" : "-translate-x-full md:translate-x-0")
      }
    >
      <div className="flex items-center justify-center bg-blue-600 h-14 md:h-12 transition-all duration-200">
        <img src={logo} className="w-8 h-8 mr-1" alt="Logo" />
        <p className="mr-3 text-2xl text-white font-websafe">Velcro</p>
      </div>
      <div>
        <Section sectionName="Tasks" />
        <Link to="/active">
          <div className={getMenuStyle("/active")}>
            <MdFileDownload size={24} className={iconStyle} />
            <p>
              Downloading
              {globalStat.numActive > 0 ? ` (${globalStat.numActive})` : ""}
            </p>
          </div>
        </Link>
        <Link to="/waiting">
          <div className={getMenuStyle("/waiting")}>
            <MdSchedule size={24} className={iconStyle} />
            <p>
              Paused
              {globalStat.numWaiting > 0 ? ` (${globalStat.numWaiting})` : ""}
            </p>
          </div>
        </Link>
        <Link to="/stopped">
          <div className={getMenuStyle("/stopped")}>
            <MdInfoOutline size={24} className={iconStyle} />
            <p>
              Finished / Stopped
              {globalStat.numStopped > 0 ? ` (${globalStat.numStopped})` : ""}
            </p>
          </div>
        </Link>
      </div>
      <div>
        <Section sectionName="Settings" />
        <Link to="/settings">
          <div className={getMenuStyle("/settings")}>
            <MdSettings size={22} className={iconStyle} />
            <p>Settings</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
