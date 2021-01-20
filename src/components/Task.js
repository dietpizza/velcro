import { formatBytes, getProgress, getFilename } from "../lib/util";

const Task = (props) => {
  const {
    errorCode,
    totalLength,
    completedLength,
    downloadSpeed,
    files,
  } = props.data;
  let progress = getProgress(completedLength, totalLength, 1);

  const getStatus = () => {
    if (errorCode !== undefined) return "Error";
    else if (completedLength === totalLength) return "Completed";
    else return formatBytes(downloadSpeed, 2) + "/s";
  };

  return (
    <div
      className={
        "items-center px-4 py-3 md:py-2 text-xs border-b border-blue-100 cursor-pointer grid grid-cols-2 md:grid-cols-16 " +
        "gap-y-1 md:gap-x-4 hover:bg-blue-100 fade-in"
      }
    >
      <p className="overflow-hidden text-sm md:text-xs md:col-span-9 col-span-2 whitespace-nowrap overflow-ellipsis">
        {getFilename(files[0])}
      </p>
      <div className="relative flex items-center col-span-2 md:col-span-3">
        <div className="flex self-auto flex-grow h-4 overflow-hidden bg-blue-200 rounded-sm">
          <div
            className="flex justify-center text-white bg-blue-500 shadow-none whitespace-nowrap"
            style={{ width: progress }}
          ></div>
        </div>
        <p className="w-10 font-bold text-right text-blue-500 md:w-12">
          {progress}
        </p>
      </div>
      <p className="col-span-1 md:col-span-2">
        <span className="inline-block pr-1 md:hidden">Size:</span>
        {formatBytes(totalLength, 2)}
      </p>
      <p className="text-right md:text-left col-span-1 md:col-span-2">
        <span className="inline-block pr-1 md:hidden">Status:</span>
        {getStatus()}
      </p>
    </div>
  );
};

export default Task;
