const formatBytes = (bytes, decimals) => {
  if (bytes === 0 || bytes === "0") return "0 B";
  var k = 1024;
  var sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
  );
};

const getFilename = (file) => {
  if (file.path === "") return file.uris[0].uri.replace(/^.*(\\|\/|:)/, "");
  else if (file.path.length > 0) return file.path.replace(/^.*(\\|\/|:)/, "");
  else return "Error";
};
const getProgress = (completed, total, digits) => {
  const progress = ((completed / total) * 100).toFixed(digits);
  if (isNaN(progress)) return "0%";
  else return progress + "%";
};

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
        "items-center px-2 py-2 text-xs border-b border-blue-200 cursor-pointer grid grid-cols-2 md:grid-cols-16 " +
        "gap-y-1 md:gap-x-4 hover:bg-blue-100 fade-in"
      }
    >
      <p className="overflow-hidden text-base md:col-span-9 col-span-2 md:text-xs whitespace-nowrap overflow-ellipsis">
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
