import { createState, useState } from "@hookstate/core";

const state = createState({ counter: 0 });

export function useGlobal() {
  return useState(state);
}
