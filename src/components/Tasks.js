import { Fragment } from "react";
import { useSelector } from "react-redux";

import Header from "./Header";
import Task from "./Task";

const Tasks = ({ view }) => {
  const data = useSelector((state) => state.data);

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
