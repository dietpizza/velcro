import { createGlobalState } from "react-hooks-global-state";

const { setGlobalState, useGlobalState } = createGlobalState({
  data: {
    active: [],
    waiting: [],
    stopped: [],
    globalStat: [],
  },
  aria2config: {},
  alerts: [],
  selected: [],
  sidebarStatus: false,
  mobileSelect: false,
});

export const setData = (data) => {
  data[2].reverse();
  setGlobalState("data", {
    active: data[0][0],
    waiting: data[1][0],
    stopped: data[2][0],
    globalStat: data[3][0],
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

export const setAria2Config = (config) => {
  setGlobalState("aria2config", config);
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

export const selectTask = (gid, op) => {
  setGlobalState("selected", (selected) =>
    op ? [...selected, gid] : selected.filter((el) => el !== gid)
  );
};

export const clearSelected = () => {
  setGlobalState("selected", []);
};

export const setSidebar = (val) => {
  setGlobalState("sidebarStatus", val);
};

export const clearMobileSelect = () => {
  setGlobalState("mobileSelect", false);
};

export { useGlobalState };
