const AlertStack = (props) => {
  return (
    <div className="absolute right-0 z-20 flex flex-col w-full p-3 pointer-events-none fill-screen md:w-auto md:max-w-sm md:p-2 space-y-2">
      {props.children}
    </div>
  );
};

export default AlertStack;
