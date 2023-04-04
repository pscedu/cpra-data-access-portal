import { createContext } from "preact";
import { hashSignal } from "./hash";
import { catalog, catalogSchema } from "./catalog";

export function createState() {
  const state = {};
  for (let level of catalogSchema) {
    if (level.prop == "dataset") continue;
    state[level.prop] = hashSignal(level.prop, catalog.choices({}, level)[0]);
  }

  state.getCurrentEntry = (datasetId) => {
    const entry = {};
    for (let level of catalogSchema) {
      entry[level.prop] =
        level.prop == "dataset" ? datasetId : state[level.prop].value;
    }
    return entry;
  };

  return state;
}

export const State = createContext();
