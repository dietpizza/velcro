const AlertStack = (props) => {
  return (
    <div
      className={
        "flex flex-col absolute fill-screen w-full md:w-auto md:max-w-sm text-sm text-gray-500 " +
        "right-0 z-20 p-3 md:p-2 space-y-2 overflow-hidden pointer-events-none"
      }
    >
      {props.children}
    </div>
  );
};

export default AlertStack;
