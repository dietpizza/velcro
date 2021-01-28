import { useSelector } from "react-redux";
import Alert from "./Alert";

const AlertStack = () => {
  const alerts = useSelector((state) => state.alerts);
  return (
    <div className="absolute right-0 z-40 flex flex-col w-full p-3 pointer-events-none fill-screen md:w-auto md:max-w-sm md:p-2 space-y-2">
      {alerts.map((alert) => (
        <Alert
          content={alert.content}
          key={alert.id}
          id={alert.id}
          timeout={alert.timeout}
          priority={alert.priority}
        />
      ))}
    </div>
  );
};

export default AlertStack;
