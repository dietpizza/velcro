import { useState, useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Aria2 from "aria2";
import Interval from "react-interval";

// Import components
import Task from "./components/Task";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Actionbar from "./components/Actionbar";
import Footer from "./components/Footer";
import Alert from "./components/Alert";
import AlertStack from "./components/AlertStack";
import NewDownload from "./components/NewDownload";

const App = () => {
  // Global State
  const [sidebarStatus, setSidebarStatus] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [enableUpdate, setEnableUpdate] = useState(false);
  const [data, setData] = useState({
    active: [],
    waiting: [],
    stopped: [],
    globalStat: [],
  });

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
    aria2
      .batch(calls)
      .then((promises) => {
        Promise.all(promises)
          .then((result) => {
            setData({
              active: result[0],
              waiting: result[1],
              stopped: result[2],
              globalStat: result[3],
            });
          })
          .catch(() => console.log("One or more calls failed"));
      })
      .catch(() => console.log("Batch call failed"));
  };

  // Get taskview
  const getTasks = (view) => {
    return (
      <div className="flex flex-col flex-grow h-0 overflow-y-auto">
        <Header />
        {data[view].map((el) => (
          <Task key={el.gid} data={el} />
        ))}
      </div>
    );
  };

  const getAlerts = () => {
    return alerts.map((alert) => (
      <Alert
        content={alert.content}
        key={alert.id}
        id={alert.id}
        timeout={alert.timeout}
        destroy={(id) => {
          setAlerts((oldAlerts) => oldAlerts.filter((el) => el.id !== id));
        }}
        variant={alert.priority}
      />
    ));
  };

  // Alert mechanism
  const addAlert = (content, timeout, priority) => {
    const id = Math.random().toString(16).substring(7);
    if (priority === "critical") timeout = 20000;
    setAlerts((oldAlerts) => [
      ...oldAlerts,
      { content, id, timeout, priority },
    ]);
  };

  // Run a test call to check connectivity
  const testConnection = async () => {
    let flag = true;
    aria2
      .listMethods()
      .then(() => {
        getData();
        addAlert("Aria2 RPC connected! ", 3000, "info");
      })
      .catch(() => (flag = false));
    return flag;
  };

  // Close sidebar if window resized to smaller width (Mobile friendly layout)
  const sidebarMonitor = function () {
    document.documentElement.style.setProperty(
      "--app-height",
      window.innerHeight + "px"
    );
    if (window.innerWidth < 720) {
      setSidebarStatus(false);
    }
  };

  // componentDidMount using useEffect
  useEffect(() => {
    let interval;
    sidebarMonitor();
    window.addEventListener("resize", sidebarMonitor);
    testConnection().then((isConnected) => {
      if (isConnected) setEnableUpdate(true);
    });

    return () => {
      setEnableUpdate(false);
      clearInterval(interval);
    };
    //eslint-disable-next-line
  }, []);

  return (
    <div className="flex h-full fade-in font-websafe ">
      <Interval callback={getData} timeout={1000} enabled={enableUpdate} />
      <AlertStack>{getAlerts()}</AlertStack>
      <Sidebar
        open={sidebarStatus}
        closeSidebar={() => setSidebarStatus(false)}
        count={data.globalStat}
      />
      <div className="flex flex-col flex-grow ml-0 md:ml-56">
        <div className="flex flex-col justify-between flex-grow">
          <Actionbar openSidebar={() => setSidebarStatus(true)} />
          <Route path="/" exact>
            <Redirect to="/active" />
          </Route>
          <Switch>
            <Route path="/active">{getTasks("active")}</Route>
            <Route path="/waiting">{getTasks("waiting")}</Route>
            <Route path="/stopped">{getTasks("stopped")}</Route>
            <Route path="/new">
              <NewDownload aria2={aria2} />
            </Route>
          </Switch>
          <Footer data={data.globalStat} />
        </div>
      </div>
    </div>
  );
};

export default App;
