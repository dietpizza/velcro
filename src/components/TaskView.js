import { Fragment } from "react";
import Header from "./Header";
import Task from "./Task";

import { shallowEqual, useSelector } from "react-redux";

const TaskView = ({ view }) => {
  const data = useSelector((state) => state.data, shallowEqual);
  return (
    <Fragment>
      <Header />
      {data[view].map((el) => (
        <Task key={el.gid} data={el} />
      ))}
    </Fragment>
  );
};

export default TaskView;
