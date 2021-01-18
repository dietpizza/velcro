import { useRef } from "react";
import { ArrowDownCircle, PauseCircle, CheckCircle } from "react-feather";
import useOnClickOutside from "use-onclickoutside";
import logo from "../assets/velcro.svg";

const Sidebar = (props) => {
  const ref = useRef(null);
  useOnClickOutside(ref, () => props.closeBar());
  const getStrokeWidth = () => {
    if (window.innerWidth < 720) return 1.5;
    else return 2.0;
  };
  return (
    <div
      ref={ref}
      className={
        "fixed z-10 h-full overflow-auto bg-gray-700 shadow " +
        "transition duration-200 transform-gpu w-56 ease-in-out " +
        (props.open ? "translate-x-0" : "-translate-x-full md:translate-x-0")
      }
    >
      <div className="flex items-center justify-center h-12 bg-blue-500">
        <img src={logo} className="h-8" alt="Logo" />
        <p className="pl-1 pr-4 text-2xl text-blue-50">Velcro</p>
      </div>
      <p className="px-3 py-1 text-xs text-gray-400 bg-gray-600 border-b border-gray-700">
        Tasks
      </p>
      <div>
        <div
          className="flex items-center w-full h-12 px-4 py-2 text-gray-300 cursor-pointer justify-items-start hover:bg-gray-600"
          onClick={() => {
            props.updateView("active");
            props.closeBar();
          }}
        >
          <ArrowDownCircle size={22} strokeWidth={getStrokeWidth()} />
          <p className="pl-3 text-sm">Downloading</p>
        </div>
        <div
          className="flex items-center w-full h-12 px-4 py-2 text-gray-300 cursor-pointer justify-items-start hover:bg-gray-600"
          onClick={() => {
            props.updateView("waiting");
            props.closeBar();
          }}
        >
          <PauseCircle size={22} strokeWidth={getStrokeWidth()} />
          <p className="pl-3 text-sm">Paused</p>
        </div>
        <div
          className="flex items-center w-full h-12 px-4 py-2 text-gray-300 cursor-pointer justify-items-start hover:bg-gray-600"
          onClick={() => {
            props.updateView("stopped");
            props.closeBar();
          }}
        >
          <CheckCircle size={22} strokeWidth={getStrokeWidth()} />
          <p className="pl-3 text-sm">Stopped / Finished</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
