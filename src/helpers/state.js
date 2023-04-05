import { createContext } from "preact";
import { effect, signal } from "@preact/signals";
import { catalog, catalogSchema } from "./catalog";
import { base } from "../helpers/mapstyle";

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

  state.compare = signal(null);
  state.maps = signal([]);

  // Update the map style when scenarios change.
  effect(() => {
    state.maps.value.forEach((map, i) => {
      const scenario = state.scenarios.value[i];
      const origin = document.location.origin;
      map.setStyle({
        version: 8,
        glyphs: `${origin}/assets/style/glyphs/{fontstack}/{range}.pbf`,
        sources: base.getSources(),
        layers: base.getLayers(),
        transition: {
          duration: 0,
          delay: 0,
        },
      });
    });
  });

  return state;
}

export const State = createContext();
