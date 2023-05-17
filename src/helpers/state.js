import { createContext } from "preact";
import { batch, computed, effect, signal } from "@preact/signals";
import { catalog } from "./catalog";
import { datasetsMap, fileFormats } from "./dataset";
import { getBaseStyle } from "./mapstyle";
import { getTimeseriesData } from "./timeseries";

let allGeographies = [];

export function createState() {
  const state = {};
  const initial = catalog.select({
    dataset: window.location.pathname.replace(/^\/dataset\//, ""),
  });

  state.scenarios = signal([{ ...initial.scenario, updateStyle: true }]);
  state.choices = signal([initial.choices]);
  state.compare = signal(null);
  state.maps = signal([]);
  state.geographies = signal([]);

  // Get the dataset spec.
  state.dataset = computed(() => datasetsMap[state.scenarios.value[0].dataset]);

  // Geographic unit
  state.geographicUnit = computed(
    () => state.scenarios.value[0].geographicUnit
  );

  // Update the map style when scenarios change.
  effect(() => {
    if (!state.dataset.value) return;
    state.maps.value.forEach((map, i) => {
      const scenario = state.scenarios.value[i];
      if (!scenario.updateStyle) return;

      const baseStyle = getBaseStyle();
      const datasetStyle = state.dataset.value.getStyle(scenario);
      const sources = { ...baseStyle.sources, ...datasetStyle.sources };
      const layers = [...baseStyle.layers, ...datasetStyle.layers];
      layers.sort((a, b) => a.order - b.order);

      const origin = document.location.origin;
      console.log(`Updating style for map ${i}`);
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
          if (!allGeographies.length)
            allGeographies = rows.map((row) => row.geoid);
          for (let row of rows) {
            map.setFeatureState(
              { ...target, id: row.geoid },
              { value: row.value }
            );
          }
        } else {
          for (let id of allGeographies)
            map.removeFeatureState({ ...target, id }, "value");
        }
      }
    }
  });

  // Reset geographies when the geographic unit changes.
  effect(() => {
    state.geographicUnit.value;
    state.geographies.value = [];
    allGeographies = [];
  });

  state.updateScenarios = (options, scenarioIdx) => {
    const newScenarios = [];
    const newChoices = [];

    const optionsKeys = Object.keys(options);
    const updateStyle =
      state.dataset.value.fileFormats.includes(fileFormats.geoTiff) ||
      !(optionsKeys.length == 1 && optionsKeys[0] == "timeValue");

    for (let i in state.scenarios.value) {
      let scenario = state.scenarios.value[i];
      let choices = state.choices.value[i];
      if (scenarioIdx === undefined || i == scenarioIdx) {
        const result = catalog.select({ ...scenario, ...options });
        newScenarios.push({ ...result.scenario, updateStyle });
        newChoices.push(result.choices);
      } else {
        newScenarios.push({ ...scenario, updateStyle: false });
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
      state.scenarios.value = [
        ...state.scenarios.value,
        { ...state.scenarios.value[0], updateStyle: true },
      ];
      state.choices.value = [...state.choices.value, state.choices.value[0]];
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
