import { MdPlayArrow, MdDelete, MdPause, MdAdd, MdMenu } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

import { getIconSize } from "../lib/util";
import { useGlobalState, setSidebar, addAlert } from "../globalState";

import { confirm } from "./Confirm";

const Divider = () => {
  return (
    <div className="w-0 h-6 border-r border-gray-200 border-solid md:h-5" />
  );
};

const Actionbar = ({ aria2, update }) => {
  const buttonStyle =
    "focus:outline-none disabled:opacity-40 transition-opacity duration-200 ease-in-out ";
  const iconStyle = " transition-all duration-200 ease-in-out ";

  const path = useLocation().pathname.substring(1);
  const [selected] = useGlobalState("selected");
  const [mobileSelect, setMobileSelect] = useGlobalState("mobileSelect");

  const action = async (op) => {
    let calls = selected.map((el) => [op, el]);
    if (calls.length > 0) {
      try {
        await aria2.multicall(calls);
        if (mobileSelect) setMobileSelect(false);
      } catch (err) {
        addAlert({
          content: "Operation failed",
          variant: "error",
        });
      }
      update();
    }
  };

  return (
    <div className="z-20 flex items-center flex-shrink-0 w-full shadow md:shadow-none md:border-b md:border-gray-200 select-none space-x-3 md:space-x-2 h-14 md:h-12 text-gray-500">
      <div
        className="flex items-center md:hidden"
        onClick={() => {
          if (!mobileSelect) setSidebar(true);
        }}
      >
        <MdMenu
          size={getIconSize()}
          className={
            "mx-4 cursor-pointer" +
            iconStyle +
            (mobileSelect ? " opacity-30" : "")
          }
        />
        <Divider />
      </div>
      <Link to="/new">
        <div className={"pr-1 cursor-pointer " + iconStyle}>
          <button
            disabled={path === "new" || mobileSelect}
            className={buttonStyle + " flex items-center"}
          >
            <MdAdd size={getIconSize()} />
            <p className="text-base md:text-sm">New</p>
          </button>
        </div>
      </Link>
      <Divider />
      <div className="flex items-center space-x-2 justify-between space-x-2">
        <button
          disabled={path !== "active" || selected.length < 1}
          className={buttonStyle}
          onClick={() => {
            action("forcePause");
          }}
        >
          <MdPause size={getIconSize()} className={iconStyle} />
        </button>
        <button
          disabled={path !== "waiting" || selected.length < 1}
          className={buttonStyle}
          onClick={() => {
            action("unpause");
          }}
        >
          <MdPlayArrow size={getIconSize()} className={iconStyle} />
        </button>
        <button
          className={buttonStyle}
          disabled={selected.length < 1}
          onClick={() => {
            confirm({
              title: "Remove?",
              message: "Selected downloads will be removed. Are you sure?",
              actionText: "Remove",
              cancelText: "Cancel",
            }).then((res) => {
              if (res) {
                if (path === "stopped") {
                  action("removeDownloadResult");
                } else {
                  action("remove");
                }
              }
            });
          }}
        >
          <MdDelete size={getIconSize() - 4} className={iconStyle} />
        </button>
      </div>
    </div>
  );
};

export default Actionbar;
