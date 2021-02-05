import React, { useState } from "react";
import { Dialog } from "@reach/dialog";
import { createConfirmation, confirmable } from "../lib/confirm";

import Button from "./Button";

const Confirm = ({
  title,
  show,
  proceed,
  message,
  actionText,
  cancelText,
  dismiss,
}) => {
  const [render, setRender] = useState(false);
  return (
    <Dialog
      isOpen={show}
      aria-label="Dialog"
      className={
        "absolute top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-900 shadow bg-opacity-40 " +
        (render ? "fade-out" : "fade-in")
      }
      onAnimationEnd={() => {
        if (render) dismiss();
      }}
    >
      <div className="w-full mx-3 bg-gray-100 rounded shadow md:mx-0 md:w-120 fade-in transform-gpu -translate-y-1/2 md:-translate-y-1/3">
        <div className="p-4 pb-0 text-2xl text-blue-600 ">
          {title || "Confirmation"}
        </div>
        <div className="py-2 px-4 text-sm text-gray-700 ">{message}</div>
        <div className="flex justify-end pt-2 p-4 text-sm text-gray-700 space-x-2">
          <Button
            onClick={() => {
              setRender(true);
              proceed(false);
            }}
            text={cancelText || "No"}
          />
          <Button
            onClick={() => {
              setRender(true);
              proceed(true);
            }}
            text={actionText || "Yes"}
            color="red"
          />
        </div>
      </div>
    </Dialog>
  );
};

export const confirm = createConfirmation(confirmable(Confirm));
