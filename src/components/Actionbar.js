import {
  IoGrid,
  IoPlay,
  IoTrash,
  IoPause,
  IoMenuSharp,
  IoAddSharp,
} from "react-icons/io5";

import { getIconSize } from "../lib/util";

import { Link, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";

import { confirm } from "./Confirm";

const Divider = () => {
  return (
    <div className="w-0 h-6 border-r border-gray-300 border-solid md:h-5" />
  );
};

const Actionbar = ({
  openSidebar,
  clearSelected,
  aria2,
  selected,
  getData,
  selectAll,
}) => {
  const buttonStyle =
    "focus:outline-none disabled:text-gray-300 active:text-blue-500";
  const history = useHistory();
  const [all, setAll] = useState(true);

  const getDisabled = (path) => {
    return path === undefined
      ? false
      : selected.length === 0 || window.location.pathname !== path;
  };
  const action = (op) => {
    let calls = selected.map((el) => [op, el]);
    aria2
      .multicall(calls)
      .then(() => {
        getData();
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    if (selected.length === 0) setAll(true);
  }, [selected]);

  return (
    <div
      className={
        "z-20 flex items-center flex-shrink-0 w-full px-1 text-gray-500 shadow select-none space-x-3" +
        " md:space-x-2 h-14 md:h-12 transition-all duration-200"
      }
    >
      <div className="flex items-center md:hidden" onClick={openSidebar}>
        <IoMenuSharp
          size={getIconSize()}
          className="ml-3 mr-4 cursor-pointer active:text-blue-500"
        />
        <Divider />
      </div>
      <Link to="/new" onClick={clearSelected}>
        <div className="flex items-center pr-1 cursor-pointer space-x-1 hover:text-blue-500">
          <IoAddSharp size={getIconSize() + 2} />
          <p className="text-base md:text-sm">New</p>
        </div>
      </Link>
      <Divider />
      <div className="flex items-center justify-between space-x-3">
        <button
          disabled={getDisabled("/active")}
          className={buttonStyle}
          onClick={() => {
            action("pause");
            history.push("/waiting");
          }}
        >
          <IoPause size={getIconSize()} />
        </button>
        <button
          disabled={getDisabled("/waiting")}
          className={buttonStyle}
          onClick={() => {
            action("unpause");
            history.push("/active");
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
        <button
          className={buttonStyle}
          onClick={() => {
            if (selected.length === 1) selectAll(false);
            else {
              selectAll(all);
              setAll(!all);
            }
          }}
        >
          <IoGrid size={getIconSize() - 6} />
        </button>
      </div>
    </div>
  );
};

export default Actionbar;
