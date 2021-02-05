const Button = ({ text, color, onClick, disabled, type }) => {
  let style =
    "px-4 py-1.5 shadow text-white font-medium rounded-sm md:font-bold focus:outline-none disabled:opacity-50 ";
  switch (color) {
    case "red":
      style += "bg-red-500";
      break;
    case "blue":
      style += "bg-blue-500";
      break;
  }
  return (
    <button className={style} onClick={onClick} disabled={disabled} type={type}>
      {text}
    </button>
  );
};

export default Button;
