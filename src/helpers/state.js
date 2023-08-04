import { createContext } from "preact";
import { batch, computed, effect, signal } from "@preact/signals";
import { catalog } from "./catalog";
import { datasetsMap, fileFormats } from "./dataset";
import { getBaseStyle } from "./mapstyle";
import { getTimeseriesData } from "./timeseries";
import { getDatasetColor, scenarioName } from "./utils";

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
  state.mapData = signal([]);
  state.showIntro = signal(true);
  state.showSidebar = signal(false);

  // Get the dataset spec.
  state.dataset = computed(() => datasetsMap[state.scenarios.value[0].dataset]);

  // Geographic unit
  state.geographicUnit = computed(
    () => state.scenarios.value[0].geographicUnit
  );

  // Time unit
  state.timeUnit = computed(() => state.scenarios.value[0].timeUnit);

  // Aggregate
  state.aggregate = computed(() => state.scenarios.value[0].aggregate);

  // Update map feature state.
  effect(() => {
    // Trigger effect when mapData or geographies change.
    // state.mapData.value and state.geographies.value must be included in this
    // function; otherwise, the effect is not triggered when these signal values change.
    for (let map of state.maps.value)
      state.updateMapFeatureState(
        map,
        state.mapData.value,
        state.geographies.value
      );
  });

  // Update the map style when scenarios change.
  effect(() => {
    if (!state.dataset.value) return;
    state.maps.value.forEach((map, i) => {
      const scenario = state.scenarios.value[i];
      if (!scenario || !scenario.updateStyle) return;

      const baseStyle = getBaseStyle();
      const datasetStyle = state.dataset.value.getStyle(
        scenario,
        state.dataset.value
      );
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
    let result = [];
    if (state.dataset.value.route)
      result = await getTimeseriesData(
        state.dataset.value.route,
        state.scenarios.value
      );
    state.mapData.value = result;
  });

  // Reset geographies when the geographic unit changes.
  effect(() => {
    state.geographicUnit.value;
    state.geographies.value = [];
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
          label: `${state.geographies.value[g]}${
            state.scenarios.value.length > 1 ? `: ${scenarioName(s, true)}` : ""
          }`,
          borderColor: getDatasetColor(g, s * -80),
          borderWidth: 2,
          data: apiData[s][g].map((row) => ({
            x: row.elapsed_year,
            y: row[state.dataset.value.valueProp || "value"],
          })),
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
    map.on("load", () => state.updateMapFeatureState(map));

    map.on("click", "geography-fill", (e) => {
      if (e.features) {
        const newGeographies = state.geographies.peek().slice();
        for (let feature of e.features) {
          let idx = newGeographies.indexOf(feature.id);
          idx === -1
            ? newGeographies.push(feature.id)
            : newGeographies.splice(idx, 1);
        }
        state.geographies.value = newGeographies;
      }
    });
    map.on(
      "mousemove",
      "geography-fill",
      () => (map.getCanvas().style.cursor = "pointer")
    );
    map.on(
      "mouseleave",
      "geography-fill",
      () => (map.getCanvas().style.cursor = "")
    );

    return map;
  };

  state.updateMapFeatureState = (map, data, geo) => {
    if (!map.isStyleLoaded() || state.geographicUnit.value == "undefined")
      return;

    const mapIdx = state.maps.value.indexOf(map);
    const mapData = (data || state.mapData.value)[mapIdx] || [];
    const geographies = geo || state.geographies.value;
    const target = {
      source: "geography-vector",
      sourceLayer: state.geographicUnit.value,
    };

    const featureValues = {};
    for (let row of mapData)
      featureValues[row.geography] =
        row[state.dataset.value.valueProp || "value"];

    const maxId = {
      clara: 476,
      ecoregion: 32,
      hydro_compartment: 1657,
      extraction_point: 2941,
    }[state.geographicUnit.value];

    for (let id = 1; id <= maxId; id++) {
      let feature = { ...target, id };
      let currentState = map.getFeatureState(feature);
      let featureState = { value: featureValues[id] };
      let geoIdx = geographies.indexOf(id);
      featureState.selected = geoIdx >= 0 ? getDatasetColor(geoIdx) : null;
      if (
        currentState.value !== featureState.value ||
        currentState.selected !== featureState.selected
      )
        map.setFeatureState(feature, featureState);
    }
  };

  return state;
}

export const State = createContext();
