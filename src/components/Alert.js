import { useState } from "react";

const Alert = ({ id, content, timeout, variant, destroy }) => {
  let alertStyle =
    "p-2 ml-auto bg-opacity-90 text-white rounded font-medium md:font-bold shadow fade-in ";

  const [render, setRender] = useState(false);

  switch (variant) {
    case "error":
      alertStyle += "bg-red-500";
      break;
    default:
      alertStyle += "bg-blue-500";
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
