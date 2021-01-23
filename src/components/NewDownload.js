import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { isURL, isPath, isSpeed } from "../lib/util";

const NewDownload = ({ aria2, aria2config, getData }) => {
  const [config, _setConfig] = useState({});
  const lastDir = localStorage.getItem("lastDir");
  const lastFile = localStorage.getItem("lastFile");
  const setConfig = (property) => {
    _setConfig((oldConfig) => {
      return { ...oldConfig, ...property };
    });
  };
  const [enableDownload, setEnableDownload] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setConfig({
      split: aria2config.split,
      dir: lastDir !== null ? lastDir : aria2config.dir,
      "force-save": aria2config["force-save"],
      "max-download-limit": aria2config["max-download-limit"],
    });
    if (lastFile !== null) setConfig({ out: lastFile });
  }, [aria2config]);

  useEffect(() => {
    if (
      isURL(config.url) &&
      parseInt(config.split) > 0 &&
      isPath(config.dir) &&
      isSpeed(config["max-download-limit"])
    )
      setEnableDownload(true);
    else setEnableDownload(false);
    console.log(config);
    if (lastDir === aria2config.dir) {
      localStorage.removeItem("lastDir");
    }
    console.log(lastDir);
  }, [config]);

  return (
    <div className="flex flex-col flex-grow h-0 overflow-y-auto text-sm text-gray-600">
      <div className="flex flex-col items-center w-full px-4 py-3 border-b border-gray-200 md:py-2 md:flex-row">
        <p className="w-full md:w-2/5">URI:</p>
        <input
          type="url"
          className="w-full p-2 border border-gray-300 outline-none resize-none md:py-1 focus:border-blue-300"
          placeholder="Eg.- https://google.com"
          onChange={(e) => {
            e.preventDefault();
            setConfig({ url: e.target.value });
          }}
        />
      </div>
      <div className="flex flex-col items-center w-full px-4 py-3 border-b border-gray-200 md:py-2 md:flex-row">
        <p className="w-full md:w-2/5">Download Path:</p>
        <input
          type="url"
          className="w-full p-2 border border-gray-300 outline-none resize-none md:py-1 focus:border-blue-300"
          defaultValue={lastDir !== null ? lastDir : ""}
          placeholder={config.dir}
          onChange={(e) => {
            e.preventDefault();
            let value = e.target.value;
            if (value.length === 0) setConfig({ dir: aria2config.dir });
            else setConfig({ dir: value });
          }}
        />
      </div>
      <div className="flex flex-col items-center w-full px-4 py-3 border-b border-gray-200 md:py-2 md:flex-row">
        <p className="w-full md:w-2/5">Filename:</p>
        <input
          type="url"
          className="w-full p-2 border border-gray-300 outline-none resize-none md:py-1 focus:border-blue-300"
          defaultValue={lastFile !== null ? lastFile : ""}
          placeholder="Original"
          onChange={(e) => {
            e.preventDefault();
            let value = e.target.value;
            let tmp = config;
            delete tmp["out"];
            if (value.length === 0) _setConfig(tmp);
            else setConfig({ out: value });
          }}
        />
      </div>
      <div className="flex flex-col items-center w-full px-4 py-3 border-b border-gray-200 md:py-2 md:flex-row">
        <p className="w-full md:w-2/5">Segments:</p>
        <input
          type="number"
          className="w-full p-2 border border-gray-300 outline-none resize-none md:py-1 focus:border-blue-300"
          placeholder={config.split}
          onChange={(e) => {
            e.preventDefault();
            let value = parseInt(e.target.value);
            if (isNaN(value)) value = aria2config.split;
            setConfig({ split: value.toString() });
          }}
        />
      </div>
      <div className="flex flex-col items-center w-full px-4 py-3 border-b border-gray-200 md:py-2 md:flex-row">
        <p className="w-full md:w-2/5">Max Download Speed:</p>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 outline-none resize-none md:py-1 focus:border-blue-300"
          placeholder={config["max-download-limit"]}
          onChange={(e) => {
            e.preventDefault();
            let value = e.target.value;
            if (value.trim().length === 0) value = "0";
            setConfig({ "max-download-limit": value });
          }}
        />
      </div>
      <div className="flex flex-col items-center w-full px-4 py-3 border-b border-gray-200 md:py-2 md:flex-row">
        <p className="w-full md:w-2/5">Referer:</p>
        <input
          type="url"
          className="w-full p-2 border border-gray-300 outline-none resize-none md:py-1 focus:border-blue-300"
          placeholder="Eg.- https://google.com"
          onChange={(e) => {
            e.preventDefault();
            setConfig({ referer: e.target.value });
          }}
        />
      </div>
      <div className="flex flex-col items-center w-full px-4 py-3 border-b border-gray-200 md:py-2 md:flex-row">
        <p className="w-full md:w-2/5">Force Save:</p>
        <select
          className="w-full p-2 border border-gray-300 outline-none resize-none md:py-1 focus:border-blue-300 bg-gray-50"
          defaultValue={config["force-save"] === "true"}
          onChange={(e) => {
            e.preventDefault();
            setConfig({ "force-save": e.target.value });
          }}
        >
          <option value={"true"}>True</option>
          <option value={"false"}>False</option>
        </select>
      </div>
      <div className="flex justify-start p-4 py-2 space-x-2">
        <button
          onClick={() => {
            if (window.confirm("Discard Data?")) history.goBack();
          }}
          className="px-4 py-2 font-bold text-blue-600 bg-blue-200 border border-blue-500 focus:outline-none"
        >
          Discard
        </button>
        <button
          disabled={!enableDownload}
          className="px-4 py-2 font-bold text-green-600 bg-green-200 border border-green-500 focus:outline-none disabled:opacity-50"
          onClick={() => {
            aria2.call("addUri", [config.url], config).then(() => {
              if (config.dir !== aria2config.dir)
                localStorage.setItem("lastDir", config.dir);
              else localStorage.removeItem("lastDir");
              if (config.out) localStorage.setItem("lastFile", config.out);
              else localStorage.removeItem("lastFile");
              getData();
              history.push("/active");
            });
          }}
        >
          Download
        </button>
      </div>
    </div>
  );
};
export default NewDownload;
