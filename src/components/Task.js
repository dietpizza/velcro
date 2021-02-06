import { formatBytes, getProgress, getFilename } from "../lib/util";
import { useGlobalState, selectTask } from "../globalState";
import { isMobile } from "react-device-detect";
import { useHistory } from "react-router-dom";
import LongPress from "react-long";
import { useEffect, useState } from "react";

const Task = ({ data }) => {
  const {
    gid,
    errorCode,
    totalLength,
    completedLength,
    downloadSpeed,
    files,
  } = data;
  let progress = getProgress(completedLength, totalLength, 1);

  const [selected] = useGlobalState("selected");
  const [select, setSelect] = useState(selected.includes(gid));
  const [mobileSelect, setMobileSelect] = useGlobalState("mobileSelect");
  const history = useHistory();

  useEffect(() => {
    setSelect(selected.includes(gid));
    //eslint-disable-next-line
  }, [selected]);

  const getStatus = () => {
    if (errorCode !== undefined && errorCode !== "0") return "Error";
    else if (completedLength === totalLength && totalLength !== "0")
      return "Completed";
    else return formatBytes(downloadSpeed, 2) + "/s";
  };
  const taskStyle =
    "relative items-center p-2 px-4 md:px-3 md:py-0 text-xs text-gray-700 border-b border-gray-200 " +
    "grid grid-cols-2 md:grid-cols-16 gap-y-1 md:gap-x-4 fade-in w-full cursor-pointer select-none ";
  const metaStyle = "pr-1 text-xs text-gray-500 md:hidden";

  return (
    <LongPress
      time={300}
      onLongPress={() => {
        if (selected.length === 0) {
          setMobileSelect(true);
          selectTask(gid, true);
        }
      }}
      onPress={() => {
        if (selected.length === 1 && selected[0] === gid) {
          setMobileSelect(false);
          selectTask(gid, false);
        } else {
          if (mobileSelect) selectTask(gid, !select);
          else history.push("/task/" + gid);
        }
      }}
    >
      <div
        className={taskStyle + (select ? " bg-gray-200" : "")}
        onClick={() => {
          if (!isMobile) selectTask(gid, !select);
        }}
      >
        <div className="flex items-center text-sm md:my-2 md:text-xs md:col-span-9 col-span-2">
          <div
            className={
              "mx-1 h-3 w-3 rounded-full " +
              (select ? "bg-blue-500" : "bg-gray-200")
            }
          ></div>
          <span className={metaStyle}>Name:</span>
          <p
            className={
              "px-1 overflow-hidden " +
              (!select
                ? "rounded md:hover:text-white md:cursor-pointer md:hover:bg-gray-500 md:transition-all duration-200 ease-in-out"
                : "")
            }
            onClick={() => {
              if (!isMobile && !select) history.push("/task/" + gid);
            }}
          >
            {getFilename(files[0])}
          </p>
        </div>
        <div className="relative flex items-center col-span-2 md:col-span-3">
          <div className="flex self-auto flex-grow h-4 overflow-hidden bg-blue-200 rounded-sm">
            <div
              className="flex justify-center text-white bg-blue-500 shadow-none whitespace-nowrap"
              style={{ width: progress }}
            ></div>
          </div>
          <p className="font-bold text-right text-blue-600 w-11 md:w-12">
            {progress}
          </p>
        </div>
        <p className="col-span-1 md:col-span-2">
          <span className={metaStyle}>Size:</span>
          {formatBytes(totalLength, 2)}
        </p>
        <p className="text-right md:text-left col-span-1 md:col-span-2">
          <span className={metaStyle}>Status:</span>
          {getStatus()}
        </p>
      </div>
    </LongPress>
  );
};

export default Task;
