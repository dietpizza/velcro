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
};

function stateReducer(state = initialState, action) {
  switch (action.type) {
    case actions.setData: {
      const result = action.payload;
      result[2].reverse();
      state.data = {
        active: result[0],
        waiting: result[1],
        stopped: result[2],
        globalStat: result[3],
      };
      return state;
    }
    case actions.setSelected: {
      state.selected = action.payload;
      return state;
    }
    case actions.selectTask: {
      const { gid, op } = action.payload;
      state.selected = op
        ? [...state.selected, gid]
        : state.selected.filter((el) => el !== gid);
      return state;
    }
    case actions.openSidebar: {
      state.sidebarStatus = true;
      return state;
    }
    case actions.closeSidebar: {
      state.sidebarStatus = false;
      return state;
    }
    case actions.aria2config: {
      state.aria2config = action.payload;
      return state;
    }
    case actions.addAlert: {
      state.alerts = [...state.alerts, action.payload];
      return state;
    }
    case actions.destroyAlert: {
      state.alerts = state.alerts.filter((el) => el.id !== action.payload);
      return state;
    }
    default:
      return state;
  }
}

const enableReduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__?.();

export const store = createStore(stateReducer, enableReduxDevTools);
