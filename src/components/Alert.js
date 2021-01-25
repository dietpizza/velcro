import { useEffect, useState } from "react";

const Alert = ({ id, content, timeout, destroy, priority }) => {
  const [render, setRender] = useState(false);
  const [alertStyle, setStyle] = useState(
    "p-2 ml-auto bg-opacity-95 font-medium md:font-bold shadow border fade-in "
  );
  useEffect(() => {
    switch (priority) {
      case "critical":
        setStyle((a) => a + "border-red-300 bg-red-200 text-red-500");
        break;
      case "success":
        setStyle((a) => a + "border-green-300 bg-green-100 text-green-500");
        break;
      default:
        setStyle((a) => a + "border-blue-300 bg-blue-100 text-blue-500");
    }
    setTimeout(() => {
      setRender(true);
    }, timeout);
    //eslint-disable-next-line
  }, []);
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
