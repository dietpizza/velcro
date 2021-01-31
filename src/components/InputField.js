const InputField = ({ text, children }) => {
  return (
    <div className="flex flex-col items-center w-full p-2 text-gray-600 border-b border-gray-200 md:px-4 md:flex-row">
      <p className="w-full pb-1 select-none md:w-2/5 md:p-0">{text}</p>
      {children}
    </div>
  );
};

export default InputField;
