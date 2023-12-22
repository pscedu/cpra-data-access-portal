import { createContext } from "preact";
import { batch, computed, effect, signal } from "@preact/signals";
import { catalog } from "./catalog";
import { datasets, datasetsMap, fileFormats } from "./dataset";
import { readHash, writeHash } from "./hash";
import { getBaseStyle } from "./mapstyle";
import { getApiData, getApiUrl } from "./api";
import { getDatasetColor } from "./utils";

/**
 * Create a state object containing signals and functions for altering state.
 * @returns {Object} - State object.
 */
export function createState() {
  const state = {};
  const hash = readHash();
  const initial = hash.scenarios.map((scenario) =>
    catalog.select({
      ...scenario,
      dataset: window.location.pathname.replace(/^\/dataset\//, ""),
    })
  );

  state.scenarios = signal(
    initial.map(({ scenario }) => ({
      ...scenario,
      updateStyle: true,
    }))
  );
  state.choices = signal(initial.map(({ choices }) => choices));
  state.compare = signal(null);
  state.contextMenu = signal(null);
  state.maps = signal([]);
  state.geographies = signal(hash.geographies);
  state.mapData = signal([]);
  state.mapDataLoading = signal(false);
  state.showIntro = signal(window.location.hostname != "localhost");
  state.showSidebar = signal(false);
  state.datasetDescriptions = signal({});
  state.chartRange = signal(hash.chartRange);
  state.mapTimeouts = [];
  state.geographyIdCache = {};

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

  // Load dataset descriptions.
  effect(() => {
    (async () => {
      const res = await fetch("/documentation.html");
      const html = await res.text();
      const descriptions = {};
      for (let dataset of datasets) {
        let matches = html.match(
          `<h3 id="${dataset.docId || dataset.id}">.+<\/h3>[^]*?<p>([^]+?)</p>`
        );
        if (matches) descriptions[dataset.id] = matches[1].replace(/\n/g, "");
      }
      state.datasetDescriptions.value = descriptions;
    })();
  });

  // Update map feature state.
  effect(() => {
    // Trigger effect when mapData or geographies change.
    // state.mapData.value and state.geographies.value must be included in this
    // function; otherwise, the effect is not triggered when these signal values change.
    for (let mapIdx in state.maps.value) {
      state.updateMapFeatureState(
        mapIdx,
        state.mapData.value,
        state.geographies.value
      );
    }
  });

  // Update the map style when scenarios change.
  effect(() => {
    if (!state.dataset.value) return;
    state.maps.value.forEach((map, i) => {
      let scenario = state.scenarios.peek()[i];
      if (scenario && scenario.updateStyle) map.setStyle(state.getMapStyle(i));
    });
  });

  // Update the map feature state when the scenarios change.
  effect(async () => {
    let result = [];
    if (state.dataset.value && state.dataset.value.route) {
      state.mapDataLoading.value = true;
      const url = getApiUrl({
        dataset: state.dataset.value,
        scenarios: state.scenarios.value.map((scenario) => ({
          ...scenario,
          timeUnit: scenario.timeUnit == "daily" ? "annual" : scenario.timeUnit,
        })),
      });
      const duplicateSid =
        state.scenarios.value.length > 1 &&
        state.scenarios.value[0].sid == state.scenarios.value[1].sid;
      result = await getApiData(url);
      if (duplicateSid) result[1] = result[0];
    }

    batch(() => {
      state.mapDataLoading.value = false;
      state.mapData.value = result;
    });
  });

  // Update the URL hash when the scenarios change.
  effect(() =>
    writeHash(
      state.scenarios.value,
      state.geographies.value,
      state.chartRange.value
    )
  );

  /**
   * Update a single scenario or all scenarios using the given options.
   * @param {Object} options - Options object containing keys that match
   * catalog indexes.
   * @param {number} [scenarioIdx] - Index of the scenario to update. If it is not
   * provided, all scenarios are updated.
   */
  state.updateScenarios = (options, scenarioIdx) => {
    if (!state.dataset.value) return;

    const newScenarios = [];
    const newChoices = [];

    const updateStyle =
      state.dataset.value.fileFormats.includes(fileFormats.geoTiff) ||
      "geographicUnit" in options ||
      "dataset" in options;

    for (let i in state.scenarios.value) {
      let scenario = state.scenarios.value[i];
      let choices = state.choices.value[i];
      if (scenarioIdx === undefined || parseInt(i, 10) == scenarioIdx) {
        const result = catalog.select({ ...scenario, ...options });
        newScenarios.push({ ...result.scenario, updateStyle });
        newChoices.push(result.choices);
      } else {
        newScenarios.push({ ...scenario, updateStyle: false });
        newChoices.push(choices);
      }
    }
    batch(() => {
      // Clear the selected geographies if the geographic unit has changed.
      if (
        state.scenarios.value[0].geographicUnit !=
        newScenarios[0].geographicUnit
      )
        state.geographies.value = [];
      state.scenarios.value = newScenarios;
      state.choices.value = newChoices;
      if (updateStyle) state.mapData.value = [];
    });
  };

  /**
   * Add a new scenario. By default, the scenario is identical to the first scenario.
   */
  state.addScenario = () => {
    batch(() => {
      state.scenarios.value = [
        ...state.scenarios.value,
        { ...state.scenarios.value[0], updateStyle: true },
      ];
      state.choices.value = [...state.choices.value, state.choices.value[0]];
    });
  };

  /**
   * Remove the scenario matching the given index.
   * @param {number} scenarioIdx - Index of the scenario to remove.
   */
  state.removeScenario = (scenarioIdx) => {
    batch(() => {
      for (let sig of [state.scenarios, state.choices])
        sig.value = sig.value.filter((_, i) => i != scenarioIdx);
    });
  };

  /**
   * Generate the MapLibre GL style object for the given map.
   * @param {number} mapIdx - Map index.
   * @returns {Object} - Map style object.
   */
  state.getMapStyle = (mapIdx) => {
    const scenario = state.scenarios.value[mapIdx];
    const baseStyle = getBaseStyle();
    const datasetStyle = state.dataset.value.getStyle(
      scenario,
      state.dataset.value
    );
    const sources = { ...baseStyle.sources, ...datasetStyle.sources };
    const layers = [...baseStyle.layers, ...datasetStyle.layers];
    layers.sort((a, b) => a.order - b.order);

    const origin = document.location.origin;
    return {
      version: 8,
      glyphs: `${origin}/style/glyphs/{fontstack}/{range}.pbf`,
      sources,
      layers,
      transition: {
        duration: 0,
        delay: 0,
      },
    };
  };

  /**
   * Update the feature state for the given map.
   * @param {number} mapIdx - Index of the map to update.
   * @param {Object[]} data - Map data from the time series API.
   * @param {*[]} geo - Selected geography IDs.
   */
  state.updateMapFeatureState = (mapIdx, data, geo) => {
    const geoUnit = state.geographicUnit.value;
    if (state.mapTimeouts[mapIdx]) clearTimeout(state.mapTimeouts[mapIdx]);
    if (geoUnit === undefined) return;

    const map = state.maps.value[mapIdx];

    // If the map style is not loaded, retry until it is.
    if (!map || !map.isStyleLoaded()) {
      state.mapTimeouts[mapIdx] = setTimeout(
        () => state.updateMapFeatureState(mapIdx, data, geo),
        100
      );
      return;
    }

    // Get map data and geography values from the state if they were not provided.
    const mapData = (data || state.mapData.value)[mapIdx] || [];
    const geographies = geo || state.geographies.value;
    const target = {
      source: "geography-vector",
      sourceLayer: geoUnit,
    };

    // Create an ID cache for this geographic unit if it doesn't already exist.
    // This cache is used to iterate over the geographies and clear the state
    // if the geography doesn't have a current value.
    state.geographyIdCache[geoUnit] =
      state.geographyIdCache[geoUnit] || new Set();
    const idCache = state.geographyIdCache[geoUnit];

    // Add geographies to the ID cache.
    for (let id of geographies) idCache.add(id);

    // Create an object that maps geography ID to the value.
    const featureValues = {};
    for (let row of mapData) {
      featureValues[row.geography] =
        row[state.dataset.value.valueProp || "value"];
      idCache.add(row.geography);
    }

    // Iterate over the ID cache, and set values from the value map.
    for (let id of idCache) {
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
