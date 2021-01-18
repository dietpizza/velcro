import { useState, useEffect } from "react";
import Aria2 from "aria2";

// Import components
import Task from "./components/Task";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

const App = () => {
  // Global State
  const [view, setView] = useState("active");
  const [openSidebar, setOpenSidebar] = useState(false);
  const [tasks, setTasks] = useState({
    active: [],
    waiting: [],
    stopped: [],
    empty: [],
    global: {},
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
    try {
      Promise.all(await aria2.batch(calls))
        .then((result) => {
          setTasks({
            active: result[0],
            waiting: result[1],
            stopped: result[2],
            global: result[3],
          });
        })
        .catch(() => console.log("batch fault"));
    } catch (err) {
      console.log("failed");
    }
  };

  const testConnection = () => {
    let flag = true;
    aria2
      .listMethods()
      .then(() => {
        console.log("connected");
        getData();
      })
      .catch((err) => {
        console.log(err);
        flag = false;
      });
    return flag;
  };

  useEffect(() => {
    let interval;
    if (testConnection()) {
      interval = setInterval(getData, 1000);
    }
    const sidebarMonitor = function () {
      if (window.innerWidth < 720) {
        setOpenSidebar(false);
      }
    };
    window.addEventListener("resize", sidebarMonitor);
    console.log("componentDidMount");

    return () => {
      clearInterval(interval);
      console.log("componentDidUnmount");
    };
    //eslint-disable-next-line
  }, []);

  return (
    <div className="flex fade-in">
      <Sidebar
        updateView={(e) => setView(e)}
        open={openSidebar}
        closeBar={() => setOpenSidebar(false)}
      />
      <div className="w-full mA-0 md:ml-56">
        <Navbar openSidebar={() => setOpenSidebar(true)} />
        <Header />
        {tasks[view].map((el) => {
          return <Task key={el.gid} data={el} />;
        })}
      </div>
    </div>
  );
};

export default App;
