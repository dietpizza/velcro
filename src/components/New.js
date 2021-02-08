import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { read } from "clipboardy";

import InputField from "./InputField";
import Button from "./Button";

import { isURL, isPath, isSpeed, isNum } from "../lib/util";
import { useGlobalState, addAlert } from "../globalState";

const New = ({ aria2, update }) => {
  const lastDir = localStorage.getItem("lastDir");
  const lastFile = localStorage.getItem("lastFile");
  const inputStyle =
    "w-full p-2 border border-gray-300 outline-none resize-none md:py-1 focus:border-blue-500 ";

  const history = useHistory();
  const [aria2config] = useGlobalState("aria2config");
  const loaded = useRef(0);

  const [enable, setEnable] = useState(false);
  const [config, _setConfig] = useState({});
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
      isNum(config.split) &&
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
        dir: lastDir || aria2config.dir,
        out: lastFile || "",
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
        <InputField text="URL Link:">
          <input
            type="url"
            className={inputStyle}
            defaultValue={config.url || ""}
            placeholder="Eg.- https://speed.hetzner.de/100MB.bin"
            onChange={(e) => {
              setConfig({ url: e.target.value.trim() || "" });
            }}
          />
        </InputField>
        <InputField text="Location:">
          <input
            type="url"
            className={inputStyle}
            defaultValue={lastDir}
            placeholder={config.dir}
            onChange={(e) => {
              setConfig({ dir: e.target.value.trim() || aria2config.dir });
            }}
          />
        </InputField>
        <InputField text="Filename:">
          <input
            type="text"
            className={inputStyle}
            defaultValue={lastFile || ""}
            placeholder="Original"
            onChange={(e) => {
              setConfig({ out: e.target.value.trim() || "" });
            }}
          />
        </InputField>
        <InputField text="Segments:">
          <input
            type="number"
            className={inputStyle}
            placeholder={config.split}
            onChange={(e) => {
              setConfig({ split: e.target.value.trim() || aria2config.split });
            }}
          />
        </InputField>
        <InputField text="Max Speed:">
          <input
            type="text"
            className={inputStyle}
            placeholder={config["max-download-limit"]}
            onChange={(e) => {
              setConfig({ "max-download-limit": e.target.value.trim() || "0" });
            }}
          />
        </InputField>
        <InputField text="Referer:">
          <input
            type="url"
            className={inputStyle}
            placeholder="Eg.- https://soundcloud.com"
            onChange={(e) => {
              setConfig({ referer: e.target.value.trim() || "" });
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
        <div className="flex justify-start p-3 select-none md:px-4 space-x-2">
          <Button
            disabled={!enable}
            color="blue"
            text="Download"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};
export default New;
