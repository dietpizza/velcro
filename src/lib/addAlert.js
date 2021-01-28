import { actions } from "../redux";

const addAlert = ({ dispatch, content, priority, timeout }) => {
  priority = priority || "info";
  timeout = timeout || 3000;
  timeout = priority === "critical" ? 20000 : timeout;
  dispatch({ type: actions.addAlert, payload: { content, priority, timeout } });
};

export default addAlert;
