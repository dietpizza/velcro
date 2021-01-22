import { useEffect } from "react";

const Alert = ({ id, content, timeout, destroy }) => {
  useEffect(() => {
    setTimeout(() => {
      console.log("timeout");
      destroy(id);
    }, timeout);
  }, []);
  return (
    <div className="right-0 flex text-xs font-medium text-gray-500 fade-in justify-items-end">
      <div className="p-2 ml-auto bg-blue-200 border border-blue-400 opacity-80 shadow">
        {content}
      </div>
    </div>
  );
};

export default Alert;
