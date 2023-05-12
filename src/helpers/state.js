import { createContext } from "preact";
import { batch, computed, effect, signal } from "@preact/signals";
import { catalog } from "./catalog";
import { datasetsMap } from "./dataset";
import { getBaseStyle } from "./mapstyle";
import { getTimeseriesData } from "./timeseries";

export function createState() {
  const state = {};
  const initial = catalog.select({
    dataset: window.location.pathname.replace(/^\/dataset\//, ""),
  });

  state.scenarios = signal([initial.scenario]);
  state.choices = signal([initial.choices]);
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

  // Update the map feature state when the scenarios change.
  effect(async () => {
    if (state.dataset.value.route) {
      const tsData = await getTimeseriesData(
        state.dataset.value.route,
        state.scenarios.value
      );
      console.log(tsData);
      for (let i in state.maps.value) {
        let map = state.maps.value[i];
        let scenario = state.scenarios.value[i];
        let rows = tsData[i];
        let target = {
          source: "geography-vector",
          sourceLayer: scenario.geographicUnit,
        };
        if (rows.length) {
          for (let row of rows) {
            map.setFeatureState(
              { ...target, id: row.geoid },
              { value: row.value }
            );
          }
        } else {
          map.removeFeatureState(target);
        }
      }
    }
  });

  state.updateScenarios = (options, scenarioIdx) => {
    const newScenarios = [];
    const newChoices = [];

    for (let i in state.scenarios.value) {
      let scenario = state.scenarios.value[i];
      let choices = state.choices.value[i];
      if (scenarioIdx === undefined || i == scenarioIdx) {
        const result = catalog.select({ ...scenario, ...options });
        newScenarios.push(result.scenario);
        newChoices.push(result.choices);
      } else {
        newScenarios.push(scenario);
        newChoices.push(choices);
      }
    }
    batch(() => {
      state.scenarios.value = newScenarios;
      state.choices.value = newChoices;
    });
  };

  state.addScenario = () => {
    batch(() => {
      for (let sig of [state.scenarios, state.choices])
        sig.value = [...sig.value, sig.value[0]];
    });
  };
  state.removeScenario = (scenarioIdx) => {
    batch(() => {
      for (let sig of [state.scenarios, state.choices])
        sig.value = sig.value.filter((_, i) => i != scenarioIdx);
    });
  };

  return state;
}

export const State = createContext();
