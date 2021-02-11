import { useState, useEffect } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import { useWindowSize } from "@react-hook/window-size";
import { read } from "clipboardy";

import Aria2 from "aria2";
import useWindowFocus from "use-window-focus";

import { isURL, defaultRpcConfig, dataCalls } from "./lib/util";
import {
  setData,
  addAlert,
  resetData,
  setSidebar,
  clearSelected,
  useGlobalState,
  setAria2Config,
  clearMobileSelect,
} from "./globalState";

import Interval from "react-interval";
import Tasks from "./components/Tasks";
import Sidebar from "./components/Sidebar";
import Actionbar from "./components/Actionbar";
import Footer from "./components/Footer";
import AlertStack from "./components/AlertStack";
import New from "./components/New";
import Loading from "./components/Loading";
import Settings from "./components/Settings";

const App = () => {
  const [isConnected, setConnected] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [link, setLink] = useState(null);

  const [selected, setSelected] = useGlobalState("selected");
  const [mobileSelect] = useGlobalState("mobileSelect");

  const [width, height] = useWindowSize({ wait: 50 });
  const windowFocus = useWindowFocus();
  const path = useLocation().pathname;
  const history = useHistory();

  const [config, setConfig] = useState(
    JSON.parse(localStorage.getItem("rpc-config")) || defaultRpcConfig
  );
  const aria2 = new Aria2(config);

  const forceUpdate = () => {
    setConfig(JSON.parse(localStorage.getItem("rpc-config")));
  };

  const getIndex = () => {
    return path === "/active"
      ? 0
      : path === "/waiting"
      ? 1
      : path === "/stopped"
      ? 2
      : -1;
  };
  const filterSelected = (data) => {
    const index = getIndex();
    if (index > -1) {
      const arr = data[index].map((e) => e.gid);
      setSelected(selected.filter((e) => arr.includes(e)));
    }
  };

  const mainLoop = async () => {
    if (isConnected) {
      await update();
    } else {
      try {
        const config = await aria2.call("getGlobalOption", []);
        setConnected(true);
        await update();
        addAlert({ content: "Aria2 RPC connected!" });
        setAria2Config(config);
      } catch (err) {}
    }
  };

  const update = async () => {
    try {
      const result = await aria2.multicall(dataCalls);
      setData(result);
      filterSelected(result);
    } catch (err) {
      setConnected(false);
      resetData();
      addAlert({
        content: "Aria2 RPC disconnected!",
        variant: "error",
      });
    }
  };

  const grabLink = async () => {
    if (windowFocus) {
      try {
        const text = await read();
        const lastLink = localStorage.getItem("lastLink");
        if ((text !== link || text !== lastLink) && isURL(text)) {
          setLink(text);
          localStorage.setItem("lastLink", text);
          history.push("/new");
        }
      } catch (err) {}
    }
  };

  //eslint-disable-next-line
  useEffect(() => grabLink(), [windowFocus]);

  useEffect(() => {
    document.documentElement.style.setProperty("--app-height", height + "px");
    if (width < 720) setSidebar(false);
    //eslint-disable-next-line
  }, [width, height]);

  useEffect(() => {
    clearSelected();
    setSidebar(false);
    if (mobileSelect) {
      clearMobileSelect();
    }
    if (getIndex() < 0) {
      setLoading(false);
    } else setLoading(true);
    //eslint-disable-next-line
  }, [path]);

  useEffect(() => {
    mainLoop();
    //eslint-disable-next-line
  }, []);

  return (
    <div className="relative flex h-full font-websafe fade-in">
      <Interval callback={mainLoop} timeout={1000} enabled={true} />
      <AlertStack />
      <Sidebar />
      <div className="flex flex-col flex-grow md:ml-60">
        <div className="flex flex-col flex-grow fade-in">
          <Actionbar aria2={aria2} update={() => update()} />
          <div className="relative flex flex-col items-center flex-grow h-0 overflow-y-auto">
            <Loading show={!isConnected && isLoading} />
            <Switch>
              <Route path="/" exact>
                <Redirect to="/active" />
              </Route>
              <Route path="/active">
                <Tasks view="active" />
              </Route>
              <Route path="/waiting">
                <Tasks view="waiting" />
              </Route>
              <Route path="/stopped">
                <Tasks view="stopped" />
              </Route>
              <Route path="/settings">
                <Settings forceUpdate={forceUpdate} />
              </Route>
              <Route path="/new">
                <New aria2={aria2} update={() => update()} />
              </Route>
            </Switch>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default App;
