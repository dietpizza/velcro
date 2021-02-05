const Button = ({ text, color, onClick, disabled, type }) => {
  let style =
    "py-2 px-4 shadow text-white text-xs font-medium rounded-sm font-websafe md:font-bold focus:outline-none disabled:opacity-60 ";
  switch (color) {
    case "red":
      style += "bg-red-500";
      break;
    case "blue":
      style += "bg-blue-500";
      break;
    default:
      style += "bg-gray-700";
  }
  return (
    <button className={style} onClick={onClick} disabled={disabled} type={type}>
      {text.toUpperCase()}
    </button>
  );
};

export default Button;
