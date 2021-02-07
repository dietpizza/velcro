import { useEffect, useState } from "react";

import { destroyAlert } from "../globalState";

const Alert = ({ id, content, timeout, variant }) => {
  let alertStyle =
    "p-2 ml-auto bg-opacity-80 text-white rounded font-medium md:font-bold shadow ";

  const [render, setRender] = useState(false);

  switch (variant) {
    case "error":
      alertStyle += "bg-red-500";
      break;
    default:
      alertStyle += "bg-blue-500";
  }
  useEffect(() => {
    const time = setTimeout(() => {
      setRender(true);
    }, timeout);
    return () => {
      clearTimeout(time);
    };
    //eslint-disable-next-line
  }, []);

  return (
    <div className="right-0 flex text-xs font-medium justify-items-end">
      <div
        className={alertStyle + (render ? " fade-out" : " fade-in")}
        onAnimationEnd={() => {
          if (render) destroyAlert(id);
        }}
      >
        {content}
      </div>
    </div>
  );
};

export default Alert;
