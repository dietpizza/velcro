import { formatBytes, getIconSize } from "../lib/util";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";
import { useSelector } from "react-redux";

const Footer = () => {
  const downloadSpeed = useSelector(
    (state) => state.data.globalStat.downloadSpeed
  );
  const uploadSpeed = useSelector((state) => state.data.globalStat.uploadSpeed);
  return (
    <div className="flex items-center justify-center h-8 px-5 text-xs text-gray-600 border-t border-gray-200 select-none md:h-10 md:justify-end">
      <div className="flex items-center mr-1">
        <IoArrowDown size={getIconSize() - 10} className="mx-1 text-blue-600" />
        <p>{formatBytes(downloadSpeed, 2) + "/s"}</p>
      </div>
      <div className="flex items-center ml-1">
        <IoArrowUp size={getIconSize() - 10} className="mx-1 text-green-600" />
        <p>{formatBytes(uploadSpeed, 2) + "/s"}</p>
      </div>
    </div>
  );
};

export default Footer;
