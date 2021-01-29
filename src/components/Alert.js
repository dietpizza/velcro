import { useState } from "react";

const Alert = ({ id, content, timeout, priority, destroy }) => {
  let alertStyle =
    "p-2 ml-auto bg-opacity-95 font-medium md:font-bold shadow border fade-in ";

  const [render, setRender] = useState(false);

  switch (priority) {
    case "critical":
      alertStyle += "border-red-300 bg-red-200 text-red-500";
      break;
    case "success":
      alertStyle += "border-green-300 bg-green-100 text-green-600";
      break;
    default:
      alertStyle += "border-blue-300 bg-blue-100 text-blue-500";
  }

  setTimeout(() => {
    setRender(true);
  }, timeout);

  return (
    <div className="right-0 flex text-xs font-medium justify-items-end">
      <div
        className={alertStyle + (render ? " fade-out" : "")}
        onAnimationEnd={() => {
          if (render) destroy(id);
        }}
      >
        {content}
      </div>
    </div>
  );
};

export default Alert;
