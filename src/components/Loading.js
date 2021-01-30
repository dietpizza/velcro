const Loading = ({ show }) => {
  return (
    <div
      className={
        "absolute z-10 text-blue-600 transition-all duration-200 ease-in-out " +
        (show ? "transform-gpu translate-y-0" : "transform-gpu -translate-y-12")
      }
    >
      <div className="z-10 flex items-center px-4 py-2 bg-blue-100 border border-t-0 border-blue-300 shadow rounded-bl-md rounded-br-md">
        <svg
          className="w-4 h-4 mr-1 -ml-1 text-blue-600 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="text-xs font-medium md:font-bold">Loading</span>
      </div>
    </div>
  );
};

export default Loading;
