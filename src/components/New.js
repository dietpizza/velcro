import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { read } from "clipboardy";

import InputField from "./InputField";

import { isURL, isPath, isSpeed } from "../lib/util";
import { useGlobalState, addAlert } from "../globalState";

const New = ({ aria2, update }) => {
  const lastDir = localStorage.getItem("lastDir");
  const lastFile = localStorage.getItem("lastFile");
  const inputStyle =
    "w-full p-2 border border-gray-300 outline-none resize-none md:py-1 focus:border-blue-300";

  const [aria2config] = useGlobalState("aria2config");
  const [enable, setEnable] = useState(false);
  const loaded = useRef(0);
  const [config, _setConfig] = useState({});
  const history = useHistory();

  const setConfig = (property) => {
    _setConfig((oldConfig) => {
      return { ...oldConfig, ...property };
    });
  };
  const addUri = (e) => {
    e.preventDefault();
    aria2
      .call("addUri", [config.url], config)
      .then(() => {
        if (config.dir !== aria2config.dir)
          localStorage.setItem("lastDir", config.dir);
        else localStorage.removeItem("lastDir");
        if (config.out) localStorage.setItem("lastFile", config.out);
        else localStorage.removeItem("lastFile");
        update();
        addAlert({ content: "Download added!" });
        history.push("/active");
      })
      .catch(() => {
        addAlert({
          content: "Failed to add download",
          variant: "error",
        });
      });
  };

  useEffect(() => {
    if (
      isURL(config.url) &&
      parseInt(config.split) > 0 &&
      parseInt(config.split) < 16 &&
      isPath(config.dir) &&
      isSpeed(config["max-download-limit"])
    )
      setEnable(true);
    else setEnable(false);
  }, [config]);

  useEffect(() => {
    if (loaded.current < 2) {
      setConfig({
        split: aria2config.split,
        dir: lastDir !== null ? lastDir : aria2config.dir,
        "force-save": aria2config["force-save"],
        "max-download-limit": aria2config["max-download-limit"],
      });
    }
    loaded.current += 1;
    //eslint-disable-next-line
  }, [aria2config]);

  useEffect(() => {
    if (document.hasFocus())
      read()
        .then((text) => {
          if (isURL(text)) {
            setConfig({ url: text });
          }
        })
        .catch(() => {});
    //eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col flex-grow w-full h-0 overflow-y-auto text-sm fade-in">
      <form onSubmit={addUri} noValidate>
        <InputField text={"URL Link:"}>
          <input
            type="url"
            className={inputStyle}
            defaultValue={config.url !== undefined ? config.url : ""}
            placeholder="Eg.- https://speed.hetzner.de/100MB.bin"
            onChange={(e) => {
              setConfig({ url: e.target.value.trim() });
            }}
          />
        </InputField>
        <InputField text={"Location:"}>
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
        <InputField text={"Filename:"}>
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
        <InputField text="Max Speed:">
          <input
            type="text"
            className={inputStyle}
            placeholder={
              config["max-download-limit"] === "0"
                ? "None"
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
            defaultValue={false}
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
            disabled={!enable}
            className="px-4 py-1.5 font-medium text-blue-600 bg-blue-200 border border-blue-500 md:font-bold focus:outline-none disabled:opacity-50"
            type="submit"
          >
            Download
          </button>
        </div>
      </form>
    </div>
  );
};
export default New;
