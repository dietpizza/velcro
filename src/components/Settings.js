import { useEffect, useState } from "react";

import InputField from "./InputField";
import Button from "./Button";

import { addAlert } from "../globalState";
import { defaultRpcConfig } from "../lib/util";

const Settings = ({ forceUpdate }) => {
  const inputStyle =
    "w-full p-2 px-3 border border-gray-300 outline-none resize-none focus:border-blue-300";
  const tmpConfig = JSON.parse(localStorage.getItem("rpc-config"));

  const [config, setConfig] = useState(tmpConfig || defaultRpcConfig);
  const [change, setChange] = useState(-1);

  useEffect(() => {
    setChange((c) => c + 1);
    //eslint-disable-next-line
  }, [config]);

  return (
    <div className="flex flex-col items-center w-full overflow-y-auto text-sm fade-in">
      <form
        className="w-full"
        onSubmit={(e) => {
          e.preventDefault();
          localStorage.setItem("rpc-config", JSON.stringify(config));
          addAlert({
            content: "Settings updated...",
          });
          setChange(0);
          forceUpdate();
        }}
      >
        <InputField text="Hostname:">
          <input
            defaultValue={config.host}
            className={inputStyle}
            onChange={(e) => {
              setConfig((oldConfig) => {
                return { ...oldConfig, host: e.target.value.trim() };
              });
            }}
          />
        </InputField>
        <InputField text="Port:">
          <input
            defaultValue={config.port}
            className={inputStyle}
            onChange={(e) => {
              setConfig((oldConfig) => {
                return { ...oldConfig, port: parseInt(e.target.value.trim()) };
              });
            }}
          />
        </InputField>
        <InputField text="RPC Path:">
          <input
            defaultValue={config.path}
            className={inputStyle}
            onChange={(e) => {
              setConfig((oldConfig) => {
                return { ...oldConfig, path: e.target.value.trim() };
              });
            }}
          />
        </InputField>
        <div className="flex justify-start p-2 select-none md:px-4">
          <Button
            disabled={change < 1}
            color="blue"
            type="submit"
            text="Save"
          />
        </div>
      </form>
    </div>
  );
};

export default Settings;
