import {
  IoPlay,
  IoTrash,
  IoPause,
  IoMenuSharp,
  IoAddSharp,
} from "react-icons/io5";

import { getIconSize } from "../lib/util";
import addAlert from "../lib/addAlert";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../redux";

import { confirm } from "./Confirm";

const Divider = () => {
  return (
    <div className="w-0 h-6 border-r border-gray-300 border-solid md:h-5" />
  );
};

const Actionbar = ({ aria2, getData }) => {
  const buttonStyle =
    "focus:outline-none disabled:text-gray-300 active:text-blue-500";
  const [view, setView] = useState("");

  const dispatch = useDispatch();
  const selected = useSelector((state) => state.selected);
  const data = useSelector((state) => state.data);

  const getIndex = () => {
    const path = window.location.pathname;
    let index = -1;
    if (path === "/active") index = 0;
    if (path === "/waiting") index = 1;
    if (path === "/stopped") index = 2;
    return index;
  };
  const filterSelected = () => {
    const path = window.location.pathname;
    let index = getIndex();
    let tmpSel = [];
    if (index >= 0 && selected.length > 0) {
      const arr = data[path.substring(1)].map((e) => e.gid);
      tmpSel = selected.filter((e) => arr.includes(e));
      dispatch({ type: actions.setSelected, payload: [] });
    }
    return tmpSel;
  };

  const action = (op) => {
    let calls = filterSelected().map((el) => [op, el]);
    if (calls.length > 0)
      aria2
        .multicall(calls)
        .then(() => {
          getData();
        })
        .catch(() =>
          addAlert({
            dispatch,
            content: "Operation failed",
            priority: "critical",
          })
        );
  };

  useEffect(() => {
    const path = window.location.pathname;
    if (view !== path) setView(path);
  });

  return (
    <div
      className={
        "z-20 flex items-center flex-shrink-0 w-full px-1 text-gray-500 shadow select-none space-x-3" +
        " md:space-x-2 h-14 md:h-12 transition-all duration-200"
      }
    >
      <div
        className="flex items-center md:hidden"
        onClick={() => dispatch({ type: actions.openSidebar })}
      >
        <IoMenuSharp
          size={getIconSize()}
          className="ml-3 mr-4 cursor-pointer active:text-blue-500"
        />
        <Divider />
      </div>
      <Link to="/new">
        <div className="pr-2 cursor-pointer hover:text-blue-500">
          <button
            disabled={view === "/new"}
            className={buttonStyle + " flex items-center"}
          >
            <IoAddSharp size={getIconSize() + 2} />
            <p className="text-base md:text-sm">New</p>
          </button>
        </div>
      </Link>
      <Divider />
      <div className="flex items-center justify-between space-x-3">
        <button
          disabled={view !== "/active" || selected.length < 1}
          className={buttonStyle}
          onClick={() => {
            action("pause");
          }}
        >
          <IoPause size={getIconSize()} />
        </button>
        <button
          disabled={view !== "/waiting" || selected.length < 1}
          className={buttonStyle}
          onClick={() => {
            action("unpause");
          }}
        >
          <IoPlay size={getIconSize() - 4} />
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
                if (window.location.pathname === "/stopped")
                  action("removeDownloadResult");
                else action("remove");
              }
            });
          }}
        >
          <IoTrash size={getIconSize() - 5} />
        </button>
      </div>
    </div>
  );
};

export default Actionbar;
