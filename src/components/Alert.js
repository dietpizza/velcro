const Alert = ({ id, content, timeout, destroy, variant }) => {
  let alertStyle = "p-2 ml-auto fade-in bg-opacity-90 shadow border ";
  switch (variant) {
    case "info":
      alertStyle += "border-blue-400 bg-blue-200 text-blue-600";
      break;
    case "critical":
      alertStyle += "border-red-400 bg-red-200 text-red-600";
      break;
    case "success":
      alertStyle += "border-green-400 bg-green-200 text-green-600";
      break;
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
