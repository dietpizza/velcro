import { useState, useEffect } from "react";
import Aria2 from "aria2";

// Import components
import Task from "./components/Task";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Notification from "./components/Notifcation";

const App = () => {
  // Global State
  const [view, setView] = useState("active");
  const [openSidebar, setOpenSidebar] = useState(false);
  const [globalStat, setGlobalStat] = useState({});
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

  // Fetch info and store in state
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
            setTasks({
              active: result[0],
              waiting: result[1],
              stopped: result[2],
            });
            setGlobalStat(result[3]);
          })
          .catch(() => console.log("one or more call failed"));
      })
      .catch(() => console.log("batch call failed"));
  };

  // Run a test call to check connectivity
  const testConnection = () => {
    let flag = true;
    aria2
      .listMethods()
      .then(() => {
        getData();
      })
      .catch(() => {
        flag = false;
      });
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
    // if (testConnection()) interval = setInterval(getData, 1000);
    window.addEventListener("resize", sidebarMonitor);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Main markup
  return (
    <div className="flex h-full fade-in">
      <Notification />
      <Sidebar
        updateView={(e) => setView(e)}
        open={openSidebar}
        selected={view}
        closeBar={() => setOpenSidebar(false)}
        count={{
          active: globalStat.numActive,
          waiting: globalStat.numWaiting,
          stopped: globalStat.numStopped,
        }}
      />
      <div className="flex flex-col justify-between flex-grow w-full h-full ml-0 md:ml-56">
        <div>
          <Navbar openSidebar={() => setOpenSidebar(true)} />
          <Header />
          {tasks[view].map((el) => {
            return <Task key={el.gid} data={el} />;
          })}
        </div>
        <Footer data={globalStat} />
      </div>
    </div>
  );
};

export default App;
