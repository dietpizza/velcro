import { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import Aria2 from "aria2";

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
  const [tasks, setTasks] = useState({
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

  // Helper to store data in state
  const setData = (data) => {
    setTasks({
      active: data[0][0],
      waiting: data[1][0],
      stopped: data[2][0],
      globalStat: data[3][0],
    });
  };

  // Fetch data from aria2 rpc server
  const getData = async () => {
    const calls = [
      ["tellActive"],
      ["tellWaiting", 0, 999],
      ["tellStopped", 0, 999],
      ["getGlobalStat"],
    ];
    const data = await aria2.multicall(calls);
    setData(data);
  };

  // Get taskview
  const getTasks = (view) => {
    return (
      <div className="flex flex-col flex-grow h-32 overflow-y-auto">
        <Header />
        {tasks[view].map((el) => (
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
        destroy={removeAlert}
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

  const removeAlert = (id) => {
    setAlerts((oldAlerts) => oldAlerts.filter((el) => el.id !== id));
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
    testConnection().then((val) => {
      if (val) interval = setInterval(getData, 1000);
    });

    return () => {
      clearInterval(interval);
    };
    //eslint-disable-next-line
  }, []);

  return (
    <div className="flex h-full fade-in">
      <AlertStack>{getAlerts()}</AlertStack>
      <Sidebar
        open={sidebarStatus}
        closeSidebar={() => setSidebarStatus(false)}
        count={tasks.globalStat}
      />
      <div className="flex flex-col flex-grow ml-0 md:ml-56">
        <div className="flex flex-col justify-between flex-grow">
          <Actionbar openSidebar={() => setSidebarStatus(true)} />
          <Switch>
            <Route path="/active">{getTasks("active")}</Route>
            <Route path="/waiting">{getTasks("waiting")}</Route>
            <Route path="/stopped">{getTasks("stopped")}</Route>
            <Route path="/add">
              <NewDownload />
            </Route>
          </Switch>
          <Footer data={tasks.globalStat} />
        </div>
      </div>
    </div>
  );
};

export default App;
