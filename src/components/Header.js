const DownloadItem = () => {
  return (
    <div className="hidden w-full py-1 pr-3 text-xs antialiased bg-gray-200 md:grid grid-cols-16 gap-4">
      <p className="ml-4 col-span-9">File Name</p>
      <p className="col-span-3">Progress</p>
      <p className="col-span-2">File Size</p>
      <p className="col-span-2">Status</p>
    </div>
  );
};

export default DownloadItem;
