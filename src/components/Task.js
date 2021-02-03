import { formatBytes, getProgress, getFilename } from "../lib/util";
import { useGlobalState, selectTask } from "../globalState";
import { isMobile } from "react-device-detect";
import { useHistory } from "react-router-dom";
import LongPress from "react-long";

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
  const history = useHistory();

  const getStatus = () => {
    if (errorCode !== undefined && errorCode !== "0") return "Error";
    else if (completedLength === totalLength && totalLength !== "0")
      return "Completed";
    else return formatBytes(downloadSpeed, 2) + "/s";
  };
  const taskStyle =
    "relative items-center p-2 py-3 md:p-0 text-xs text-gray-700 transition-all duration-200 ease-in-out " +
    " border-b border-gray-200 grid grid-cols-2 md:grid-cols-16 gap-y-1 md:gap-x-4 fade-in w-full select-none";
  const metaStyle = "pr-1 text-xs text-gray-500 md:hidden";

  return (
    <LongPress
      time={300}
      onLongPress={() => history.push("/task/" + gid)}
      onPress={() => {
        if (isMobile) selectTask(gid, !selected.includes(gid));
      }}
    >
      <div
        className={
          taskStyle +
          (selected.includes(gid)
            ? " bg-blue-100 md:bg-blue-50 border-blue-200"
            : " ")
        }
      >
        <div className="flex items-center overflow-hidden text-sm md:text-xs md:col-span-9 col-span-2 whitespace-nowrap overflow-ellipsis">
          <div
            className="flex items-center justify-center w-0 h-full cursor-pointer md:w-11 transition-all duration-200 ease-in-out"
            onClick={() => {
              if (!isMobile) selectTask(gid, !selected.includes(gid));
            }}
          >
            <div
              className={
                "w-3.5 h-3.5 bg-gray-200 m-0 md:m-3 mx-0 rounded-full" +
                (selected.includes(gid) ? " bg-blue-500" : " bg-gray-200")
              }
            ></div>
          </div>
          <span className={metaStyle}>Name:</span>
          <p
            className="md:hover:text-blue-600 md:cursor-pointer"
            onClick={() => {
              if (!isMobile) history.push("/task/" + gid);
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
