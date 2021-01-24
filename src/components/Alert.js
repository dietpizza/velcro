const Alert = ({ id, content, timeout, destroy, priority }) => {
  let alertStyle =
    "p-2 ml-auto fade-in bg-opacity-95 font-medium shadow border ";
  switch (priority) {
    case "critical":
      alertStyle += "border-red-300 bg-red-200 text-red-600";
      break;
    case "success":
      alertStyle += "border-green-300 bg-green-200 text-green-600";
      break;
    default:
      alertStyle += "border-blue-300 bg-blue-200 text-blue-600";
  }
  setTimeout(() => {
    destroy(id);
  }, timeout);
  return (
    <div className="right-0 flex text-xs font-medium justify-items-end">
      <div className={alertStyle}>{content}</div>
    </div>
  );
};

export default Alert;
