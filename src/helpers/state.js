import { createContext } from "preact";
import { signal } from "@preact/signals";
import { catalog, catalogSchema } from "./catalog";

export function createState() {
  const state = {};
  const initialScenario = {};

  for (let level of catalogSchema) {
    let initialValue = catalog.choices({}, level)[0];
    if (level.scope == "global") {
      state[level.prop] = signal(initialValue);
    } else if (level.scope == "scenario") {
      initialScenario[level.prop] = initialValue;
    }
  }
  state.scenarios = signal([initialScenario]);

  state.getDatasetValues = (datasetId, scenario = {}) => {
    const values = {};
    for (let level of catalogSchema) {
      values[level.prop] =
        level.scope == "global"
          ? state[level.prop].value
          : level.scope === undefined
          ? datasetId
          : scenario[level.prop];
    }
    return values;
  };

  return state;
}

export const State = createContext();
