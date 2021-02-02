import { createGlobalState } from "react-hooks-global-state";

const { setGlobalState, useGlobalState } = createGlobalState({
  data: {
    active: [],
    waiting: [],
    stopped: [],
    globalStat: [],
  },
  alerts: [],
  selected: [],
  sidebarStatus: false,
  aria2config: {},
});

export const setData = (data) => {
  data[2].reverse();
  setGlobalState("data", {
    active: data[0],
    waiting: data[1],
    stopped: data[2],
    globalStat: data[3],
  });
};
export const resetData = () => {
  setGlobalState("data", {
    active: [],
    waiting: [],
    stopped: [],
    globalStat: [],
  });
};

export const selectTask = (gid, op) => {
  setGlobalState("selected", (selected) =>
    op ? [...selected, gid] : selected.filter((el) => el !== gid)
  );
};

export const setSidebar = (val) => {
  setGlobalState("sidebarStatus", val);
};

export const setAria2Config = (config) => {
  setGlobalState("aria2config", config);
};

export const clearSelected = () => {
  setGlobalState("selected", []);
};

export const addAlert = ({ content, variant }) => {
  const id = Math.random().toString(16).substring(7);
  const timeout = variant === "error" ? 5000 : 3000;
  setGlobalState("alerts", (alerts) => [
    ...alerts,
    { id, content, timeout, variant },
  ]);
};

export const destroyAlert = (id) => {
  setGlobalState("alerts", (alerts) => alerts.filter((el) => el.id !== id));
};

export { useGlobalState };
