const Alert = ({ id, content, timeout, destroy }) => {
  setTimeout(() => {
    destroy(id);
  }, timeout);

  return (
    <div className="right-0 flex text-xs font-medium text-gray-600 fade-in justify-items-end">
      <div className="p-2 ml-auto bg-blue-200 border border-blue-400 opacity-80 shadow">
        {content}
      </div>
    </div>
  );
};

export default Alert;
