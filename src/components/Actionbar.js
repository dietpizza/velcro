import {
  IoPlay,
  IoTrash,
  IoPause,
  IoMenuSharp,
  IoAddSharp,
} from "react-icons/io5";

import { Link, useLocation, useHistory } from "react-router-dom";

import { getIconSize } from "../lib/util";
import {
  useGlobalState,
  clearSelected,
  setSidebar,
  addAlert,
} from "../globalState";

import { confirm } from "./Confirm";

const Divider = () => {
  return (
    <div className="w-0 h-6 border-r border-gray-300 border-solid md:h-5" />
  );
};

const Actionbar = ({ aria2, update }) => {
  const buttonStyle =
    "focus:outline-none disabled:text-gray-300 active:text-blue-500";
  const iconStyle = "transition-all duration-200 ease-in-out";

  const path = useLocation().pathname.substring(1);
  const history = useHistory();
  const [selected] = useGlobalState("selected");
  const [data] = useGlobalState("data");

  const filterSelected = () => {
    const arr = data[path].map((e) => e.gid);
    const tmpSel = selected.filter((e) => arr.includes(e));
    clearSelected();
    return tmpSel;
  };

  const action = async (op) => {
    let calls = filterSelected().map((el) => [op, el]);
    let flag = false;
    if (calls.length > 0)
      try {
        await aria2.multicall(calls);
        update();
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
    <div className="z-20 flex items-center flex-shrink-0 w-full px-1 text-gray-500 shadow select-none space-x-3 md:space-x-2 h-14 md:h-12">
      <div
        className="flex items-center md:hidden fade-in"
        onClick={() => setSidebar(true)}
      >
        <IoMenuSharp
          size={getIconSize() + 1}
          className={"ml-3 mr-4 cursor-pointer " + iconStyle}
        />
        <Divider />
      </div>
      <Link to="/new">
        <div
          className={"pr-2 cursor-pointer active:text-blue-500 " + iconStyle}
        >
          <button
            disabled={path === "new"}
            className={buttonStyle + " flex items-center"}
          >
            <IoAddSharp size={getIconSize() + 2} />
            <p className="ml-1 text-base md:text-sm fade-in">New</p>
          </button>
        </div>
      </Link>
      <Divider />
      <div className="flex items-center justify-between space-x-3">
        <button
          disabled={path !== "active" || selected.length < 1}
          className={buttonStyle}
          onClick={() => {
            action("pause").then((ret) => {
              if (ret) history.push("/waiting");
            });
          }}
        >
          <IoPause size={getIconSize() + 1} className={iconStyle} />
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
          <IoPlay size={getIconSize() - 3} className={iconStyle} />
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
          <IoTrash size={getIconSize() - 3} className={iconStyle} />
        </button>
      </div>
    </div>
  );
};

export default Actionbar;
