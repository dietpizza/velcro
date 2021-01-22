import { useState, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import Aria2 from "aria2";

// Import components
import Task from "./components/Task";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Actionbar from "./components/Actionbar";
import Footer from "./components/Footer";
import Alert from "./components/Alert";
import AlertStack from "./components/AlertStack";

const App = () => {
  // Global State
  const [openSidebar, setOpenSidebar] = useState(false);
  const [globalStat, setGlobalStat] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [tasks, setTasks] = useState({
    active: [],
    waiting: [],
    stopped: [],
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
      active: data[0],
      waiting: data[1],
      stopped: data[2],
    });
    setGlobalStat(data[3]);
  };

  // Fetch data from aria2 rpc server
  const getData = () => {
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
          .then((result) => setData(result))
          .catch(() => console.log("one or more call failed"));
      })
      .catch(() => console.log("batch call failed"));
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
      />
    ));
  };

  // Alert mechanism
  const addAlert = (content, timeout) => {
    const id = Math.round(Math.random() * 1000).toString();
    console.log(id);
    setAlerts((oldAlerts) => [...oldAlerts, { content, id, timeout }]);
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
      setOpenSidebar(false);
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
        open={openSidebar}
        closeBar={() => setOpenSidebar(false)}
        count={globalStat}
      />
      <div className="flex flex-col flex-grow ml-0 md:ml-56">
        <div className="flex flex-col justify-between flex-grow">
          <Actionbar openSidebar={() => setOpenSidebar(true)} />
          <Route path="/active">{getTasks("active")}</Route>
          <Route path="/waiting">{getTasks("waiting")}</Route>
          <Route path="/stopped">{getTasks("stopped")}</Route>
          <Route>
            <Redirect to="/active" />
          </Route>
        </div>
        <Footer data={globalStat} />
      </div>
    </div>
  );
};

export default App;
