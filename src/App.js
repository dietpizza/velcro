import { useState, useEffect, useRef } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { read } from "clipboardy";
import { useWindowSize } from "@react-hook/window-size";

import Aria2 from "aria2";
import useWindowFocus from "use-window-focus";

import { isURL } from "./lib/util";
import { actions } from "./redux";
import addAlert from "./lib/addAlert";

// Import components
import Interval from "react-interval";
import TaskView from "./components/TaskView";
import Sidebar from "./components/Sidebar";
import Actionbar from "./components/Actionbar";
import Footer from "./components/Footer";
import AlertStack from "./components/AlertStack";
import NewDownload from "./components/NewDownload";
import Loading from "./components/Loading";

const App = () => {
  const dispatch = useDispatch();

  const [update, setUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const link = useRef(null);

  const history = useHistory();
  const location = useLocation();
  const windowFocus = useWindowFocus();
  const [width, height] = useWindowSize({ wait: 50 });

  const aria2 = new Aria2({
    host: window.location.hostname,
    port: 6800,
    path: "/jsonrpc",
  });

  const getData = async () => {
    const calls = [
      ["tellActive"],
      ["tellWaiting", 0, 999],
      ["tellStopped", 0, 999],
      ["getGlobalStat"],
    ];
    try {
      const result = await Promise.all(await aria2.batch(calls));
      dispatch({ type: actions.setData, payload: result });
    } catch (err) {
      setUpdate(false);
      addAlert({
        dispatch,
        content: "Aria2 RPC disconnected! Please refresh the page",
        timeout: 1000,
        priority: "critical",
      });
    }
  };

  const initClient = async () => {
    let flag = true;
    try {
      const config = await aria2.call("aria2.getGlobalOption", []);
      setIsLoading(false);
      getData();
      dispatch({ type: actions.aria2config, payload: config });
      addAlert({ dispatch, content: "Aria2 RPC connected!" });
    } catch (err) {
      setIsLoading(false);
      addAlert({
        dispatch,
        content: "Aria2 RPC connection failed. Please refresh the page.",
        priority: "critical",
      });
      flag = false;
    }
    return flag;
  };

  useEffect(() => {
    if (windowFocus)
      read()
        .then((text) => {
          if (text !== link.current && isURL(text)) {
            history.push("/new");
            link.current = text;
          }
        })
        .catch(() => {});
    //eslint-disable-next-line
  }, [windowFocus]);

  useEffect(() => {
    document.documentElement.style.setProperty("--app-height", height + "px");
    if (width < 720) {
      dispatch({ type: actions.closeSidebar });
    }
    //eslint-disable-next-line
  }, [width, height]);

  useEffect(() => {
    dispatch({ type: actions.setPath, payload: location.pathname });
    //eslint-disable-next-line
  }, [location]);

  useEffect(() => {
    initClient().then((isConnected) => {
      if (isConnected) {
        setUpdate(true);
      }
    });

    return () => {
      setUpdate(false);
    };
    //eslint-disable-next-line
  }, []);

  return (
    <div className="relative flex h-full font-websafe fade-in">
      <Interval callback={getData} timeout={1000} enabled={update} />
      <AlertStack />
      <Sidebar />
      <div className="flex flex-col flex-grow ml-0 md:ml-56 fade-in">
        <div className="flex flex-col flex-grow fade-in">
          <Actionbar aria2={aria2} getData={() => getData()} />
          <div className="relative flex flex-col items-center flex-grow h-0 overflow-y-auto">
            <Loading show={isLoading} />
            <Switch>
              <Route path="/" exact>
                <Redirect to="/active" />
              </Route>
              <Route path="/active">
                <TaskView view="active" />
              </Route>
              <Route path="/waiting">
                <TaskView view="waiting" />
              </Route>
              <Route path="/stopped">
                <TaskView view="stopped" />
              </Route>
              <Route path="/new">
                <NewDownload aria2={aria2} getData={getData} />
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
