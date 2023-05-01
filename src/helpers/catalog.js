import { sortDesc } from "./utils";

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
    name: "Plan Implementation Scenario",
    scope: "scenario",
    format: (value) =>
      ({
        G500: "Without Plan",
        G516: "With Plan",
        G520: "Without Plan",
        G521: "With Plan",
      }[value]),
    sort: sortDesc,
  },
  {
    prop: "scenario",
    name: "Environmental Scenario",
    scope: "scenario",
    format: (value) =>
      ({
        S07: "Lower",
        S08: "Higher",
      }[value]),
    sort: sortDesc,
  },
  {
    prop: "aep",
    name: "Annual Exceedance Probability",
    scope: "scenario",
    default: "10.0",
    sort: (a, b) => (parseFloat(a) < parseFloat(b) ? 1 : -1),
  },
  {
    prop: "pumping",
    name: "Pumping Scenario",
    param: "pumping_id",
    scope: "scenario",
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
  },
];

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
      choicesCache[ref] = Object.keys(obj).sort(level.sort);
    return choicesCache[ref];
  };

  const selectKey = (options, level, current) => {
    if (options[level.prop] in current) return options[level.prop];
    if (level.default !== undefined && level.default in current)
      return level.default;
    return getChoices(current, level)[0];
  };

  const select = (options = {}, levelProp, match = false) => {
    let current = index;
    const keys = {};
    for (let level of levels) {
      if (levelProp === level.prop) return match ? keys : current;
      let key = selectKey(options, level, current);
      keys[level.prop] = key;
      current = current[key];
    }
    return match ? keys : current;
  };

  const match = (options) => {
    return select(options, null, true);
  };

  const choices = (options, level) => {
    const current = select(options, level.prop);
    return getChoices(current, level);
  };

  return { add, choices, match, select };
}

export const catalog = makeCatalog();

for (let dataset of ["land-change", "ffibs"])
  catalog.add({
    dataset,
    group: ["G520", "G521"],
    scenario: ["S07", "S08"],
    timeUnit: ["decade"],
    timeValue: [0, 10, 20, 30, 40, 50],
  });

catalog.add({
  dataset: "flood-depth",
  group: ["G500", "G516"],
  scenario: ["S07", "S08"],
  timeUnit: ["decade"],
  aep: ["10.0", "2.0", "1.0", "0.2"],
  timeValue: [0, 10, 20, 30, 40, 50],
});

for (let dataset of [
  "estimated-annual-damages-dollars",
  "estimated-annual-structural-damage",
])
  catalog.add({
    dataset,
    asset: ["1", "2", "3", "4", "5", "all"],
    fragility: ["0", "1"],
    group: ["G500", "G516"],
    scenario: ["S07", "S08"],
    geographicUnit: ["clara"],
    pumping: ["0", "0.5", "1"],
    timeUnit: ["decade"],
    timeValue: [0, 10, 20, 30, 40, 50],
  });
