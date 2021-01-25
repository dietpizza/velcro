import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { isURL, isPath, isSpeed } from "../lib/util";

const InputField = ({ text, children }) => {
  return (
    <div className="flex flex-col items-center w-full p-2 border-b border-gray-200 md:px-4 md:flex-row">
      <p className="w-full pb-1 select-none md:w-2/5 md:p-0">{text}</p>
      {children}
    </div>
  );
};

const NewDownload = ({ aria2, aria2config, getData, addAlert }) => {
  const lastDir = localStorage.getItem("lastDir");
  const lastFile = localStorage.getItem("lastFile");
  const inputStyle =
    "w-full p-2 border border-gray-300 outline-none resize-none md:py-1 focus:border-blue-300";

  const history = useHistory();

  const [enableDownload, setEnableDownload] = useState(false);
  const [config, _setConfig] = useState({
    split: aria2config.split,
    dir: lastDir !== null ? lastDir : aria2config.dir,
    "force-save": aria2config["force-save"],
    "max-download-limit": aria2config["max-download-limit"],
  });

  const setConfig = (property) => {
    _setConfig((oldConfig) => {
      return { ...oldConfig, ...property };
    });
  };
  const addUri = (e) => {
    e.preventDefault();
    if (enableDownload) {
      aria2
        .call("addUri", [config.url], config)
        .then((gid) => {
          console.log(gid);
          if (config.dir !== aria2config.dir)
            localStorage.setItem("lastDir", config.dir);
          else localStorage.removeItem("lastDir");
          if (config.out) localStorage.setItem("lastFile", config.out);
          else localStorage.removeItem("lastFile");
          getData();
          addAlert("Download Added", "success");
          history.push("/active");
        })
        .catch(() => {
          addAlert("Failed to add download", "critical");
        });
    }
  };

  useEffect(() => {
    if (
      isURL(config.url) &&
      parseInt(config.split) > 0 &&
      parseInt(config.split) < 16 &&
      isPath(config.dir) &&
      isSpeed(config["max-download-limit"])
    )
      setEnableDownload(true);
    else setEnableDownload(false);
  }, [config]);

  useEffect(() => {
    if (config.dir === undefined) {
      addAlert("Aria2 RPC not connected! Redirecting to Downloads");
      history.push("/active");
    }
    //eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col flex-grow w-full h-0 overflow-y-auto text-sm text-gray-600 fade-in">
      <form onSubmit={addUri} noValidate>
        <InputField text={"URL:"}>
          <input
            type="url"
            className={inputStyle}
            placeholder="Eg.- https://speed.hetzner.de/100MB.bin"
            onChange={(e) => {
              setConfig({ url: e.target.value.trim() });
            }}
          />
        </InputField>
        <InputField text={"Download Path:"}>
          <input
            type="url"
            className={inputStyle}
            defaultValue={lastDir}
            placeholder={config.dir}
            onChange={(e) => {
              const value = e.target.value.trim();
              if (value.length === 0) setConfig({ dir: aria2config.dir });
              else setConfig({ dir: value });
            }}
          />
        </InputField>
        <InputField text={"Filename"}>
          <input
            type="text"
            className={inputStyle}
            defaultValue={lastFile !== null ? lastFile : ""}
            placeholder="Original"
            onChange={(e) => {
              const value = e.target.value.trim();
              if (value.length === 0) {
                let tmp = config;
                delete tmp["out"];
                _setConfig(tmp);
              } else setConfig({ out: value });
            }}
          />
        </InputField>
        <InputField text={"Segments:"}>
          <input
            type="number"
            className={inputStyle}
            placeholder={config.split}
            onChange={(e) => {
              let value = parseInt(e.target.value.trim());
              if (isNaN(value)) value = aria2config.split;
              setConfig({ split: value.toString() });
            }}
          />
        </InputField>
        <InputField text="Speed Limit:">
          <input
            type="text"
            className={inputStyle}
            placeholder={
              config["max-download-limit"] === "0"
                ? "None (You can append K or M too...)"
                : config["max-download-limit"]
            }
            onChange={(e) => {
              let value = e.target.value.trim();
              if (value.trim().length === 0) value = "0";
              setConfig({ "max-download-limit": value });
            }}
          />
        </InputField>
        <InputField text={"Referer:"}>
          <input
            type="url"
            className={inputStyle}
            placeholder="Eg.- https://soundcloud.com"
            onChange={(e) => {
              setConfig({ referer: e.target.value.trim() });
            }}
          />
        </InputField>
        <InputField text={"Force Save: "}>
          <select
            className={inputStyle + " bg-transparent px-1 select-none"}
            defaultValue={config["force-save"]}
            onChange={(e) => {
              setConfig({ "force-save": e.target.value.trim() });
            }}
          >
            <option value={"true"}>True</option>
            <option value={"false"}>False</option>
          </select>
        </InputField>
        <div className="flex justify-start px-2 py-2 select-none md:px-4 space-x-2">
          <button
            onClick={() => {
              if (window.confirm("Discard Data?")) history.goBack();
            }}
            className="px-4 py-2 font-medium text-red-500 bg-red-200 border-red-500 md:font-bold focus:outline-none"
          >
            Discard
          </button>
          <button
            disabled={!enableDownload}
            className="px-4 py-2 font-medium text-blue-500 bg-blue-200 border-blue-500 md:font-bold focus:outline-none disabled:opacity-50"
            type="submit"
          >
            Download
          </button>
        </div>
      </form>
    </div>
  );
};
export default NewDownload;
