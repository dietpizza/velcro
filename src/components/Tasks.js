import { Fragment } from "react";

import Header from "./Header";
import Task from "./Task";

import { useGlobalState } from "../globalState";

const Tasks = ({ view }) => {
  const [data] = useGlobalState("data");

  return (
    <Fragment>
      <Header />
      {data[view].map((el) => (
        <Task key={el.gid} data={el} />
      ))}
    </Fragment>
  );
};

export default Tasks;
