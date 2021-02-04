import { MdPlayArrow, MdDelete, MdPause, MdAdd, MdMenu } from "react-icons/md";

import { Link, useLocation, useHistory } from "react-router-dom";

import { getIconSize } from "../lib/util";
import { useGlobalState, setSidebar, addAlert } from "../globalState";

import { confirm } from "./Confirm";

const Divider = () => {
  return (
    <div className="w-0 h-6 border-r border-gray-300 border-solid md:h-5" />
  );
};

const Actionbar = ({ aria2, update }) => {
  const buttonStyle =
    "focus:outline-none disabled:opacity-30 active:text-blue-500 transition-all duration-200 ease-in-out ";
  const iconStyle = " transition-all duration-200 ease-in-out ";

  const path = useLocation().pathname.substring(1);
  const history = useHistory();
  const [selected] = useGlobalState("selected");
  const [mobileSelect, setMobileSelect] = useGlobalState("mobileSelect");

  const action = async (op) => {
    let calls = selected.map((el) => [op, el]);
    let flag = false;
    if (calls.length > 0)
      try {
        await aria2.multicall(calls);
        update();
        if (mobileSelect) setMobileSelect(false);
        flag = true;
      } catch (err) {
        addAlert({
          content: "Operation failed",
          variant: "error",
        });
      }
    return flag;
  };

  return (
    <div
      className={
        "z-20 flex items-center flex-shrink-0 w-full px-1 shadow select-none space-x-3 md:space-x-2 h-14 md:h-12 text-gray-500"
      }
    >
      <div
        className="flex items-center md:hidden fade-in"
        onClick={() => {
          if (!mobileSelect) setSidebar(true);
        }}
      >
        <MdMenu
          size={getIconSize()}
          className={
            "mx-3 cursor-pointer " +
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
            <p className="ml-1 text-base md:text-sm fade-in">New</p>
          </button>
        </div>
      </Link>
      <Divider />
      <div className="flex items-center justify-between space-x-2">
        <button
          disabled={path !== "active" || selected.length < 1}
          className={buttonStyle}
          onClick={() => {
            action("pause").then((ret) => {
              if (ret) history.push("/waiting");
            });
          }}
        >
          <MdPause size={getIconSize()} className={iconStyle} />
        </button>
        <button
          disabled={path !== "waiting" || selected.length < 1}
          className={buttonStyle}
          onClick={() => {
            action("unpause").then((ret) => {
              if (ret) history.push("/active");
            });
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
                  action("remove").then((ret) => {
                    if (ret) history.push("/stopped");
                  });
                }
              }
            });
          }}
        >
          <MdDelete size={getIconSize() - 3} className={iconStyle} />
        </button>
      </div>
    </div>
  );
};

export default Actionbar;
