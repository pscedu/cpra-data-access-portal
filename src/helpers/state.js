import { createContext } from "preact";
import { computed, effect, signal } from "@preact/signals";
import { catalog, catalogSchema } from "./catalog";
import { datasetsMap } from "./dataset";
import { getBaseStyle } from "../helpers/mapstyle";

export function createState() {
  const state = {};
  const initialScenario = {};

  state.datasetId = signal(null);

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

  // Get the dataset spec.
  state.dataset = computed(() =>
    state.datasetId.value ? datasetsMap[state.datasetId.value] : null
  );

  // Update the map style when scenarios change.
  effect(() => {
    if (!state.dataset.value) return;
    state.maps.value.forEach((map, i) => {
      const scenario = state.scenarios.value[i];
      const entry = catalog.match(
        state.getDatasetValues(state.datasetId.value, scenario)
      );

      const baseStyle = getBaseStyle();
      const datasetStyle = state.dataset.value.getStyle(entry);
      const sources = { ...baseStyle.sources, ...datasetStyle.sources };
      const layers = [...baseStyle.layers, ...datasetStyle.layers];
      layers.sort((a, b) => a.order - b.order);

      const origin = document.location.origin;
      map.setStyle({
        version: 8,
        glyphs: `${origin}/assets/style/glyphs/{fontstack}/{range}.pbf`,
        sources,
        layers,
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
