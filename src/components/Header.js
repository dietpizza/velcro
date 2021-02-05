const DownloadItem = () => {
  return (
    <div className="hidden w-full py-1 px-4 text-xs antialiased border-b border-gray-200 md:grid grid-cols-16 gap-4">
      <p className="col-span-9">File Name</p>
      <p className="col-span-3">Progress</p>
      <p className="col-span-2">File Size</p>
      <p className="col-span-2">Status</p>
    </div>
  );
};

export default DownloadItem;
