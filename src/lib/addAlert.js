import { actions } from "../redux";

const addAlert = ({ dispatch, content, priority, timeout }) => {
  const id = Math.random().toString(16).substring(7);
  priority = priority || "info";
  timeout = timeout || 3000;
  timeout = priority === "critical" ? 20000 : timeout;
  dispatch({
    type: actions.addAlert,
    payload: { content, priority, timeout, id },
  });
};

export default addAlert;
