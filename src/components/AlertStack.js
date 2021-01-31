import { useSelector, useDispatch } from "react-redux";

import { actions } from "../redux";

import Alert from "./Alert";

const AlertStack = () => {
  const alerts = useSelector((state) => state.alerts);
  const dispatch = useDispatch();
  return (
    <div className="absolute right-0 z-40 flex flex-col w-full p-3 pointer-events-none fill-screen md:w-auto md:max-w-sm md:p-2 space-y-2">
      {alerts.map(({ content, id, variant, timeout }) => (
        <Alert
          content={content}
          key={id}
          id={id}
          timeout={timeout}
          variant={variant}
          destroy={(id) =>
            dispatch({ type: actions.destroyAlert, payload: id })
          }
        />
      ))}
    </div>
  );
};

export default AlertStack;
