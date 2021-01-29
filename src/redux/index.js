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
  load: "load",
  unload: "unload",
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
  isLoading: true,
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
    case actions.setSelected: {
      return { ...state, selected: action.payload };
    }
    case actions.selectTask: {
      const { gid, op } = action.payload;
      const newSelected = op
        ? [...state.selected, gid]
        : state.selected.filter((el) => el !== gid);
      return { ...state, selected: newSelected };
    }
    case actions.openSidebar: {
      return { ...state, sidebarStatus: true };
    }
    case actions.closeSidebar: {
      return { ...state, sidebarStatus: false };
    }
    case actions.aria2config: {
      return { ...state, aria2config: action.payload };
    }
    case actions.addAlert: {
      return { ...state, alerts: [...state.alerts, action.payload] };
    }
    case actions.destroyAlert: {
      const newAlerts = state.alerts.filter((el) => el.id !== action.payload);
      return { ...state, alerts: [...newAlerts] };
    }
    case actions.load: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actions.unload: {
      return {
        ...state,
        isLoading: false,
      };
    }
    default:
      return state;
  }
}

const enableReduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__?.();

export const store = createStore(stateReducer, enableReduxDevTools);
