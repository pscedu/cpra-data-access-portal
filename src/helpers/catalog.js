import { sortAsc, sortDesc } from "./utils";

const toInt = (value) => parseInt(value, 10);
const toFloat = (value) => parseFloat(value);

// Catalog level definition objects.
export const catalogSchema = [
  {
    prop: "dataset",
    name: "Dataset",
    format: (value) =>
      ({
        damage: "Damage",
        "flood-depth": "Flood Depth",
        "land-change": "Land Change",
        projects: "Projects",
        "vegetation-type": "Vegetation Type",
      }[value]),
  },
  {
    prop: "geographicUnit",
    name: "Geography",
    scope: "global",
    format: (value) =>
      ({
        clara: "Clara Community",
        ecoregion: "Ecoregion",
      }[value]),
  },
  {
    prop: "timeUnit",
    name: "Time Unit",
    scope: "global",
    format: (value) =>
      ({
        day: "Day",
        decade: "Decade",
        year: "Year",
      }[value]),
  },
  {
    prop: "group",
    param: "model_group_name",
    name: "Plan Implementation Scenario",
    scope: "scenario",
    decode: toInt,
    format: (value) =>
      ({
        500: "Without Plan",
        516: "With Plan",
        520: "Without Plan",
        521: "With Plan",
      }[value]),
    sort: sortDesc,
  },
  {
    prop: "scenario",
    param: "scenario",
    name: "Environmental Scenario",
    scope: "scenario",
    decode: toInt,
    format: (value) =>
      ({
        7: "Lower",
        8: "Higher",
      }[value]),
    sort: sortDesc,
  },
  {
    prop: "aep",
    param: "aep",
    name: "Annual Exceedance Probability",
    scope: "scenario",
    default: 10.0,
    decode: toFloat,
    format: (value) => value.toFixed(1),
  },
  {
    prop: "pumping",
    param: "pumping_id",
    name: "Pumping Scenario",
    scope: "scenario",
    decode: toFloat,
    format: (value) =>
      ({
        0: "No Pumping",
        0.5: "50% Pumping Capacity",
        1: "Full Pumping Capacity",
      }[value]),
  },
  {
    prop: "fragility",
    param: "fragility_scenario",
    name: "Fragility Scenario",
    scope: "scenario",
    decode: toInt,
    format: (value) =>
      ({
        0: "No Fragility",
        1: "IPET Fragility",
      }[value]),
  },
  {
    prop: "asset",
    param: "asset_type",
    name: "Asset Type",
    scope: "scenario",
    format: (value) =>
      ({
        1: "Small Residential (single-family, manufactured homes, or duplex)",
        2: "Other Multi-family Residential",
        3: "Commercial, Industrial, or Agricultural",
        4: "Other Structural (public, education, or religion)",
        5: "Non-structural (crops, vehicles, or roads)",
        all: "All Asset Types",
      }[value]),
  },
  {
    prop: "timeValue",
    name: "Time Value",
    scope: "global",
    decode: toInt,
  },
];

export const paramMap = {};
for (let level of catalogSchema)
  if (level.param) paramMap[level.param] = level.prop;

const catalogLevels = {};
for (let level of catalogSchema) catalogLevels[level.prop] = level;

export function getLevel(prop) {
  return catalogLevels[prop];
}

const levels = catalogSchema;

export function makeCatalog() {
  const choicesCache = {};
  const index = {};

  // The levelObjRefs array is used to assign an index to a level object in the
  // catalog tree. This index is used as a key in the choicesCache object, since
  // objects cannot be used as keys in another object.
  const levelObjRefs = [];

  const add = (entry, currentIdx = 0, parent = index) => {
    const level = levels[currentIdx];
    let values = entry[level.prop];
    for (let value of Array.isArray(values) ? values : [values]) {
      if (levels.length - currentIdx == 1) {
        parent.push(value);
      } else {
        parent[value] =
          parent[value] || (levels.length - currentIdx == 2 ? [] : {});
        add(entry, currentIdx + 1, parent[value]);
      }
    }
  };

  const getChoices = (obj, level) => {
    if (!levelObjRefs.includes(obj)) levelObjRefs.push(obj);
    const ref = levelObjRefs.indexOf(obj);
    if (choicesCache[ref] === undefined)
      choicesCache[ref] = (Array.isArray(obj) ? obj : Object.keys(obj))
        .map((value) =>
          level.decode && value !== "undefined" ? level.decode(value) : value
        )
        .sort(level.sort || sortAsc);
    return choicesCache[ref];
  };

  const select = (options = {}) => {
    let current = index;
    const scenario = {};
    const choices = {};

    for (let level of levels) {
      choices[level.prop] = getChoices(current, level);
      let value = choices[level.prop][0];
      for (let candidate of [options[level.prop], level.default])
        if (
          candidate !== undefined &&
          choices[level.prop].includes(candidate)
        ) {
          value = candidate;
          break;
        }
      scenario[level.prop] = value;
      current = current[value];
    }
    return { scenario, choices };
  };

  return { add, schema: catalogSchema, levels: catalogLevels, select };
}

export const catalog = makeCatalog();

for (let dataset of ["land-change", "ffibs", "vct"])
  catalog.add({
    dataset,
    group: [520, 521],
    scenario: [7, 8],
    timeUnit: ["decade"],
    timeValue: [0, 10, 20, 30, 40, 50],
  });

catalog.add({
  dataset: "flood-depth",
  group: [500, 516],
  scenario: [7, 8],
  timeUnit: ["decade"],
  aep: [10.0, 2.0, 1.0, 0.2],
  timeValue: [0, 10, 20, 30, 40, 50],
});

for (let dataset of [
  "estimated-annual-damages-dollars",
  "estimated-annual-structural-damage",
])
  catalog.add({
    dataset,
    asset: ["1", "2", "3", "4", "5", "all"],
    fragility: [0, 1],
    group: [500, 516],
    scenario: [7, 8],
    geographicUnit: ["clara"],
    pumping: [0, 0.5, 1],
    timeUnit: ["decade"],
    timeValue: [0, 10, 20, 30, 40, 50],
  });

for (let dataset of ["land-area"])
  catalog.add({
    dataset,
    group: [520, 521],
    scenario: [7, 8],
    geographicUnit: ["ecoregion"],
    timeUnit: ["year"],
    timeValue: [...Array(51).keys()],
  });
