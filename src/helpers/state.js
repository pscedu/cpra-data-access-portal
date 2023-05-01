import { createContext } from "preact";
import { computed, effect, signal } from "@preact/signals";
import { catalog } from "./catalog";
import { datasetsMap } from "./dataset";
import { getBaseStyle } from "../helpers/mapstyle";

export function createState() {
  const state = {};

  state.scenarios = signal([catalog.match()]);
  state.compare = signal(null);
  state.maps = signal([]);

  // Get the dataset spec.
  state.dataset = computed(() => datasetsMap[state.scenarios.value[0].dataset]);

  // Update the map style when scenarios change.
  effect(() => {
    if (!state.dataset.value) return;
    state.maps.value.forEach((map, i) => {
      const scenario = state.scenarios.value[i];
      const baseStyle = getBaseStyle();
      const datasetStyle = state.dataset.value.getStyle(scenario);
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
