import { createContext } from "preact";
import { batch, computed, effect, signal } from "@preact/signals";
import { catalog } from "./catalog";
import { datasetsMap, fileFormats } from "./dataset";
import { getBaseStyle } from "./mapstyle";
import { getTimeseriesData } from "./timeseries";
import { scenarioName } from "./utils";

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
  state.chartDatasets = signal([]);

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
      if (!scenario || !scenario.updateStyle) return;

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
      for (let i in state.maps.value) {
        let map = state.maps.value[i];
        let scenario = state.scenarios.value[i];
        if (!scenario || !map) continue;

        let rows = tsData[i];
        let target = {
          source: "geography-vector",
          sourceLayer: scenario.geographicUnit,
        };
        if (rows.length) {
          if (!allGeographies.length)
            allGeographies = rows.map((row) => row.geography);
          for (let row of rows) {
            map.setFeatureState(
              { ...target, id: row.geography },
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

  // Fetch chart data from the timeseries API.
  effect(async () => {
    if (!state.dataset.value.route || !state.geographies.value.length) {
      state.chartDatasets.value = [];
      return;
    }

    const apiData = await getTimeseriesData(
      state.dataset.value.route,
      state.scenarios.value,
      state.geographies.value
    );
    const datasets = [];
    for (let g in state.geographies.value)
      for (let s in state.scenarios.value)
        datasets.push({
          label: `${state.geographies.value[g]} (${scenarioName(s)})`,
          borderColor: "red",
          borderWidth: 2,
          data: apiData[s][g].map((row) => ({ x: row.time, y: row.value })),
        });

    state.chartDatasets.value = datasets;
  });

  state.updateScenarios = (options, scenarioIdx) => {
    const newScenarios = [];
    const newChoices = [];

    const updateStyle =
      state.dataset.value.fileFormats.includes(fileFormats.geoTiff) ||
      "geographicUnit" in options ||
      "dataset" in options;

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

  state.initMap = (container) => {
    const firstMap = state.maps.value[0];
    // eslint-disable-next-line no-undef
    const map = new maplibregl.Map({
      container,
      style: {
        version: 8,
        sources: {},
        layers: [],
        transition: {
          duration: 0,
          delay: 0,
        },
      },
      center: firstMap ? firstMap.getCenter() : [-91.5, 29.75],
      zoom: firstMap ? firstMap.getZoom() : 6.5,
    });

    // Add map event handlers.
    map.on("data", () => {
      if (map.isStyleLoaded()) state.updateMapSelectedFeatures();
    });

    ["geography-fill", "geography-line", "geography-selected"].forEach(
      (layerName) => {
        map.on("click", layerName, (e) => {
          if (e.features) {
            const newGeographies = state.geographies.peek().slice();
            for (let feature of e.features) {
              let idx = newGeographies.indexOf(feature.id);
              if (idx === -1) {
                newGeographies.push(feature.id);
                for (let m of state.maps.peek())
                  m.setFeatureState(feature, { selected: "true" });
              } else {
                newGeographies.splice(idx, 1);
                for (let m of state.maps.peek())
                  m.removeFeatureState(feature, "selected");
              }
            }
            state.geographies.value = newGeographies;
          }
        });
        map.on(
          "mousemove",
          layerName,
          () => (map.getCanvas().style.cursor = "pointer")
        );
        map.on(
          "mouseleave",
          layerName,
          () => (map.getCanvas().style.cursor = "")
        );
      }
    );

    return map;
  };

  state.updateMapSelectedFeatures = () => {
    for (let map of state.maps.value)
      for (let id of state.geographies.value) {
        map.setFeatureState(
          {
            source: "geography-vector",
            sourceLayer: state.geographicUnit.value,
            id,
          },
          { selected: "true" }
        );
      }
  };

  return state;
}

export const State = createContext();
