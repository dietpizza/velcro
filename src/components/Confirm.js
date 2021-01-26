import React, { useState } from "react";
import { Dialog } from "@reach/dialog";
import { createConfirmation, confirmable } from "react-confirm";

const Confirm = ({ title, show, proceed, message, actionText, cancelText }) => {
  const [render, setRender] = useState(false);
  const [answer, setAnswer] = useState(false);
  return (
    <Dialog
      isOpen={show}
      className={
        "absolute top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-900 shadow fade-in bg-opacity-40 " +
        (render ? "fade-out" : "")
      }
      onAnimationEnd={() => {
        if (render) {
          proceed(answer);
        }
      }}
    >
      <div className="w-full mx-3 bg-gray-100 rounded md:mx-0 md:w-120 fade-in transform-gpu -translate-y-2/3">
        <div className="p-3 text-xl text-blue-600 border-b border-blue-200">
          {title || "Confirmation"}
        </div>
        <div className="p-3 text-sm text-gray-700 border-b border-blue-200">
          {message}
        </div>
        <div className="flex justify-end p-3 text-sm text-gray-700 space-x-2">
          <button
            onClick={() => {
              setRender(true);
              setAnswer(false);
            }}
            className="px-4 py-1.5 font-medium text-red-500 bg-red-200 border border-red-400 md:font-bold focus:outline-none"
          >
            {cancelText || "No"}
          </button>
          <button
            onClick={() => {
              setRender(true);
              setAnswer(true);
            }}
            className="px-4 py-1.5 font-medium text-blue-600 bg-blue-200 border border-blue-500 md:font-bold focus:outline-none disabled:opacity-50"
          >
            {actionText || "Yes"}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export const confirm = createConfirmation(confirmable(Confirm));
