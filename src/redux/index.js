import { createStore } from "redux";

export const actions = {
  setData: "setData",
  setSelected: "setSelected",
  selectTask: "selectTask",
  aria2config: "aria2config",
  openSidebar: "openSidebar",
  closeSidebar: "closeSidebar",
  addAlert: "addAlert",
  destroyAlert: "destroyAlert",
  setPath: "setPath",
};

const initialState = {
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
  path: null,
};

function stateReducer(state = initialState, action) {
  switch (action.type) {
    case actions.setData: {
      const result = action.payload;
      result[2].reverse();
      return {
        ...state,
        data: {
          active: result[0],
          waiting: result[1],
          stopped: result[2],
          globalStat: result[3],
        },
      };
    }
    case actions.selectTask: {
      const items = action.payload;
      return {
        ...state,
        selected: items,
      };
    }
    case actions.selectTask: {
      const { gid, op } = action.payload;
      const newArray = op
        ? Array.from(new Set([...state.selected, gid]))
        : state.selected.filter((el) => el !== gid);
      return {
        ...state,
        selected: newArray,
      };
    }
    case actions.openSidebar: {
      return {
        ...state,
        sidebarStatus: true,
      };
    }
    case actions.closeSidebar: {
      return {
        ...state,
        sidebarStatus: false,
      };
    }
    case actions.aria2config: {
      const config = action.payload;
      return {
        ...state,
        aria2config: config,
      };
    }
    case actions.addAlert: {
      let { content, timeout, priority } = action.payload;
      const id = Math.random().toString(16).substring(7);
      if (priority === undefined) priority = "info";
      if (timeout === undefined) timeout = 3000;
      if (priority === "critical") timeout = 20000;
      return {
        ...state,
        alerts: [...state.alerts, { content, id, timeout, priority }],
      };
    }
    case actions.destroyAlert: {
      const id = action.payload;
      const newAlerts = state.alerts.filter((el) => el.id !== id);
      return {
        ...state,
        alerts: newAlerts,
      };
    }
    case actions.setPath: {
      const newPath = action.payload;
      return {
        ...state,
        path: newPath,
      };
    }
    default:
      return state;
  }
}

const enableReduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__?.();

export const store = createStore(stateReducer, enableReduxDevTools);
