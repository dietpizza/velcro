import { useState, useEffect, useRef } from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { read } from "clipboardy";
import { useWindowSize } from "@react-hook/window-size";

import Aria2 from "aria2";
import useWindowFocus from "use-window-focus";

import { isURL, addAlert } from "./lib/util";
import { actions } from "./redux";

import Interval from "react-interval";
import Tasks from "./components/Tasks";
import Sidebar from "./components/Sidebar";
import Actionbar from "./components/Actionbar";
import Footer from "./components/Footer";
import AlertStack from "./components/AlertStack";
import New from "./components/New";
import Loading from "./components/Loading";

const App = () => {
  const isLoading = useSelector((state) => state.isLoading);
  const [isConnected, setConnected] = useState(false);
  const link = useRef(null);

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const windowFocus = useWindowFocus();
  const [width, height] = useWindowSize({ wait: 50 });

  const aria2 = new Aria2({
    host: window.location.hostname,
    port: 6800,
    path: "/jsonrpc",
  });

  const updateLoop = async () => {
    if (isConnected) {
      update();
      if (isLoading) dispatch({ type: actions.unload });
    } else {
      try {
        const config = await aria2.call("getGlobalOption", []);
        console.log("updateLoop");
        update();
        setConnected(true);
        dispatch({ type: actions.unload });
        addAlert({ dispatch, content: "Aria2 RPC connected!" });
        dispatch({ type: actions.aria2config, payload: config });
      } catch (err) {
        if (!isLoading) dispatch({ type: actions.load });
      }
    }
  };

  const update = async () => {
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
      dispatch({ type: actions.load });
      setConnected(false);
      addAlert({
        dispatch,
        content: "Aria2 RPC disconnected!",
        priority: "critical",
      });
    }
  };

  useEffect(() => {
    if (windowFocus)
      read()
        .then((text) => {
          if (text !== link.current && isURL(text) && isConnected) {
            history.push("/new");
            link.current = text;
          }
        })
        .catch(() => {});
    //eslint-disable-next-line
  }, [windowFocus]);

  useEffect(() => {
    document.documentElement.style.setProperty("--app-height", height + "px");
    if (width < 720) dispatch({ type: actions.closeSidebar });
    //eslint-disable-next-line
  }, [width, height]);

  useEffect(() => {
    console.log("Hello");
    dispatch({ type: actions.closeSidebar });
    dispatch({ type: actions.setSelected, payload: [] });
    //eslint-disable-next-line
  }, [location]);

  useEffect(() => {
    updateLoop();
    //eslint-disable-next-line
  }, []);

  return (
    <div className="relative flex h-full font-websafe fade-in">
      <Interval callback={updateLoop} timeout={1000} enabled={true} />
      <AlertStack />
      <Sidebar />
      <div className="flex flex-col flex-grow ml-0 md:ml-56 fade-in">
        <div className="flex flex-col flex-grow fade-in">
          <Actionbar aria2={aria2} update={() => update()} />
          <div className="relative flex flex-col items-center flex-grow h-0 overflow-y-auto">
            <Loading show={isLoading} />
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
