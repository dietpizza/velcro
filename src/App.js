import { useState, useEffect, useRef } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { actions } from "./redux";

import { read } from "clipboardy";
import Interval from "react-interval";
import Aria2 from "aria2";
import { isURL } from "./lib/util";
import addAlert from "./lib/addAlert";

// Import components
import TaskView from "./components/TaskView";
import Sidebar from "./components/Sidebar";
import Actionbar from "./components/Actionbar";
import Footer from "./components/Footer";
import AlertStack from "./components/AlertStack";
import NewDownload from "./components/NewDownload";
import Loading from "./components/Loading";

const App = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data, shallowEqual);

  const [enableUpdate, setEnableUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const lastLink = useRef("");
  const history = useHistory();

  // Connect to aria2 jsonrpc interface
  const aria2 = new Aria2({
    host: window.location.hostname,
    port: 6800,
    path: "/jsonrpc",
  });

  // Fetch data from aria2 rpc server
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
      addAlert({
        dispatch,
        content: "Aria2 RPC disconnected! Please refresh the page",
        timeout: 1000,
        priority: "critical",
      });
      setEnableUpdate(false);
    }
  };

  // Run a test call to check connectivity
  const getAria2Settings = async () => {
    let flag = true;
    try {
      const config = await aria2.call("aria2.getGlobalOption", []);
      dispatch({ type: actions.aria2config, payload: config });
      getData();
      setIsLoading(false);
      addAlert({ dispatch, content: "Aria2 RPC connected!" });
    } catch (err) {
      addAlert({
        dispatch,
        content: "Aria2 RPC connection failed. Please refresh the page.",
        priority: "critical",
      });
      setIsLoading(false);
      flag = false;
    }
    return flag;
  };

  // Close sidebar if window resized to smaller width (Mobile friendly layout)
  const sidebarMonitor = function () {
    document.documentElement.style.setProperty(
      "--app-height",
      window.innerHeight + "px"
    );
    if (window.innerWidth < 720) {
      dispatch({ type: actions.closeSidebar });
    }
  };

  const grabUrl = () => {
    read()
      .then((link) => {
        if (lastLink.current !== link && isURL(link)) {
          history.push("/new");
          lastLink.current = link;
        }
      })
      .catch(() => {});
  };
  // componentDidMount using useEffect
  useEffect(() => {
    let interval;
    sidebarMonitor();
    window.addEventListener("resize", sidebarMonitor);
    getAria2Settings().then((isConnected) => {
      if (isConnected) {
        setEnableUpdate(true);
        grabUrl();
        window.addEventListener("focus", grabUrl);
      }
    });
    history.listen((location) => {
      dispatch({ type: actions.setPath, payload: location.pathname });
    });
    return () => {
      setEnableUpdate(false);
      clearInterval(interval);
    };
    //eslint-disable-next-line
  }, []);

  return (
    <div className="relative flex h-full font-websafe fade-in">
      <Interval callback={getData} timeout={1000} enabled={enableUpdate} />
      <AlertStack />
      <Sidebar count={data.globalStat} />
      <div className="flex flex-col flex-grow ml-0 md:ml-56">
        <div className="flex flex-col justify-between flex-grow">
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
          <Footer data={data.globalStat} />
        </div>
      </div>
    </div>
  );
};

export default App;
