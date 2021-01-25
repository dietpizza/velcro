import { formatBytes, getProgress, getFilename } from "../lib/util";

const Task = ({ data, selected, selectTask }) => {
  const {
    gid,
    errorCode,
    totalLength,
    completedLength,
    downloadSpeed,
    files,
  } = data;
  let progress = getProgress(completedLength, totalLength, 1);

  const getStatus = () => {
    if (errorCode !== undefined && errorCode !== "0") return "Error";
    else if (completedLength === totalLength && totalLength !== "0")
      return "Completed";
    else return formatBytes(downloadSpeed, 2) + "/s";
  };
  const taskStyle =
    "items-center p-2 text-xs text-gray-700 border-b border-gray-200 cursor-pointer md:px-4 grid grid-cols-2 md:grid-cols-16 gap-y-1 md:gap-x-4 fade-in";
  const metaStyle = "pr-1 text-xs text-gray-500 md:hidden";

  return (
    <div
      className={taskStyle + (selected ? " bg-blue-100 border-blue-200" : "")}
      onClick={() => selectTask(gid, !selected)}
    >
      <p className="overflow-hidden text-sm md:text-xs md:col-span-9 col-span-2 whitespace-nowrap overflow-ellipsis">
        <span className={metaStyle}>Name:</span>
        {getFilename(files[0])}
      </p>
      <div className="relative flex items-center col-span-2 md:col-span-3">
        <div className="flex self-auto flex-grow h-4 overflow-hidden bg-blue-200 rounded-sm">
          <div
            className="flex justify-center text-white bg-blue-500 shadow-none whitespace-nowrap"
            style={{ width: progress }}
          ></div>
        </div>
        <p className="font-bold text-right text-blue-500 w-11 md:w-12">
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
  );
};

export default Task;
