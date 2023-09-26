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
        block_group: "Census Block Group",
        clara: "Clara Community",
        ecoregion: "Ecoregion",
        hydro_compartment: "Hydro Compartment",
        parish: "Parish",
      }[value]),
  },
  {
    prop: "aggregate",
    name: "Aggregate",
    scope: "global",
    format: (value) =>
      ({
        mean: "Mean",
        two_week_max: "2 Week Max",
      }[value]),
  },
  {
    prop: "timeUnit",
    name: "Time Unit",
    scope: "global",
    format: (value) =>
      ({
        annual: "Annual",
        daily: "Daily",
        decadal: "Decadal",
      }[value]),
  },
  {
    prop: "group",
    param: "model_group_name",
    name: "Plan Implementation Scenario",
    scope: "scenario",
    format: (value) =>
      ({
        FWOA: "Without Plan (FWOA)",
        FWMP: "With Plan (FWMP)",
      }[value]),
    sort: sortDesc,
  },
  {
    prop: "scenario",
    param: "scenario_name",
    name: "Environmental Scenario",
    scope: "scenario",
    format: (value) =>
      ({
        Lower: "Lower",
        Higher: "Higher",
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
    prop: "storm",
    param: "storm_id",
    name: "Synthetic Storm ID",
    scope: "scenario",
    default: 66,
    decode: toInt,
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
    decode: toInt,
    format: (value) =>
      ({
        1: "Small Residential (single-family, manufactured homes, or duplex)",
        2: "Other Multi-family Residential",
        3: "Commercial, Industrial, or Agricultural",
        4: "Other Structural (public, education, or religion)",
        5: "Non-structural (crops, vehicles, or roads)",
        6: "All Asset Types",
      }[value]),
    default: 6,
  },
  // {
  //   prop: "claraGroup",
  //   param: "clara_group_id",
  //   name: "CLARA Group",
  //   scope: "scenario",
  //   decode: toInt,
  // },
  {
    prop: "category",
    param: "category",
    name: "Category",
    scope: "scenario",
  },
  {
    prop: "exposure",
    param: "exposure_type",
    name: "Exposure Type",
    scope: "scenario",
  },
  {
    prop: "nsProject",
    param: "ns_project_id",
    name: "Nonstructural Project",
    scope: "scenario",
    decode: toInt,
  },
  {
    prop: "participation",
    param: "participation_rate",
    name: "Participation Rate",
    scope: "scenario",
    decode: toFloat,
    format: (value) =>
      ({
        0.5: "50% Participation",
        0.75: "75% Participation",
        1: "Full Participation",
      }[value]),
  },
  {
    prop: "migration",
    param: "migration",
    name: "Migration",
    scope: "scenario",
  },
  {
    prop: "ssp",
    param: "ssp",
    name: "Shared Socioeconomic Pathway",
    scope: "scenario",
    decode: toInt,
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

const allAEPs = [10.0, 2.0, 1.0, 0.2];
const allAssets = [1, 2, 3, 4, 5, 6];
const allCategories = [
  "Daycares",
  "Drink Water Sources",
  "Drinking Water Treatment Plants",
  "Electric Substations",
  "Emergency Medical Service Stations",
  "Fire Stations",
  "Gas Stations",
  "Hospitals",
  "Local Emergency Operations Centers",
  "Local Law Enforcement",
  "Nursing Homes",
  "Nursing Residential Care Facilities",
  "Power Plants",
  "Public Schools",
  "Veterans Health Administration Medical Facilities",
];
// const allClaraGroups = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const allDecades = [2, 12, 22, 32, 42, 52];
const allExposures = ["Exposure", "Moderate Exposure", "Severe Exposure"];
const allMigrations = ["BASE", "MIG"];
const allNSProjects = [1, 3];
const allParticipations = [0.5, 0.75, 1];
const allSSPs = [1, 2, 3, 4, 5];
const allStorms = [
  66, 68, 80, 82, 83, 87, 141, 148, 164, 165, 171, 172, 178, 180, 181, 190, 242,
  248, 253, 255, 257, 263, 268, 270, 276, 277, 278, 281, 283, 285, 288, 289,
  290, 292, 296, 297, 298, 299, 304, 312, 347, 349, 355, 358, 364, 365, 367,
  372, 373, 374, 382, 388, 391, 394, 395, 396, 397, 405, 413, 422, 439, 440,
  466, 471, 474, 479, 480, 482, 486, 488, 494, 500, 505, 509, 516, 524, 528,
  529, 530, 550, 560, 567, 573, 575, 576, 583, 584, 590, 606, 609,
];
const allYears = [...Array(51).keys()].map((i) => i + 2);

catalog.add({
  dataset: "",
});

for (let dataset of ["land-change", "vegetation-type-ffibs"])
  catalog.add({
    dataset,
    group: ["FWOA", "FWMP"],
    scenario: ["Lower", "Higher"],
    timeUnit: ["annual"],
    timeValue: allYears,
  });

catalog.add({
  dataset: "vegetation-type-vct",
  group: ["FWOA", "FWMP"],
  scenario: ["Lower", "Higher"],
  timeUnit: ["decadal"],
  timeValue: allDecades,
});

catalog.add({
  dataset: "flood-depth",
  group: ["FWOA", "FWMP"],
  scenario: ["Lower", "Higher"],
  timeUnit: ["decadal"],
  aep: allAEPs,
  timeValue: [3, 12, 22, 32, 42, 52],
});

for (let dataset of [
  "expected-annual-damages-dollars",
  "expected-annual-structural-damage",
]) {
  catalog.add({
    dataset,
    asset: allAssets,
    fragility: [0, 1],
    group: ["FWOA"],
    scenario: ["Lower", "Higher"],
    geographicUnit: ["clara"],
    pumping: [0, 0.5, 1],
    timeUnit: ["decadal"],
    timeValue: allDecades,
  });
  catalog.add({
    dataset,
    asset: allAssets,
    fragility: [0, 1],
    group: ["FWMP"],
    scenario: ["Lower", "Higher"],
    geographicUnit: ["clara"],
    pumping: [0.5],
    timeUnit: ["decadal"],
    timeValue: allDecades,
  });
}

for (let dataset of [
  "nonstructural-expected-annual-damage-dollars",
  "nonstructural-expected-annual-structural-damage",
]) {
  catalog.add({
    dataset,
    asset: allAssets,
    fragility: [0, 1],
    group: ["FWOA"],
    scenario: ["Lower", "Higher"],
    geographicUnit: ["clara"],
    nsProject: allNSProjects,
    participation: allParticipations,
    pumping: [0, 0.5, 1],
    timeUnit: ["decadal"],
    timeValue: allDecades,
  });
  catalog.add({
    dataset,
    asset: allAssets,
    fragility: [1],
    group: ["FWMP"],
    scenario: ["Lower", "Higher"],
    geographicUnit: ["clara"],
    nsProject: allNSProjects,
    participation: [1],
    pumping: [0.5],
    timeUnit: ["decadal"],
    timeValue: allDecades,
  });
}

for (let dataset of ["annual-exceedance-damages-dollars"]) {
  catalog.add({
    dataset,
    aep: allAEPs,
    asset: allAssets,
    fragility: [0, 1],
    group: ["FWOA"],
    scenario: ["Lower", "Higher"],
    geographicUnit: ["clara"],
    pumping: [0, 0.5, 1],
    timeUnit: ["decadal"],
    timeValue: allDecades,
  });
  catalog.add({
    dataset,
    aep: allAEPs,
    asset: allAssets,
    fragility: [0, 1],
    group: ["FWMP"],
    scenario: ["Lower", "Higher"],
    geographicUnit: ["clara"],
    pumping: [0.5],
    timeUnit: ["decadal"],
    timeValue: allDecades,
  });
}

catalog.add({
  dataset: "salinity",
  aggregate: ["mean", "two_week_max"],
  group: ["FWOA", "FWMP"],
  scenario: ["Lower", "Higher"],
  geographicUnit: ["hydro_compartment"],
  timeUnit: ["annual"],
  timeValue: allYears,
});

for (let dataset of ["salinity", "temperature"])
  catalog.add({
    dataset,
    aggregate: ["mean"],
    group: ["FWOA", "FWMP"],
    scenario: ["Lower", "Higher"],
    geographicUnit: ["hydro_compartment"],
    timeUnit: ["daily"],
    timeValue: allYears,
  });

for (let dataset of [
  "water-level",
  "water-level-variability",
  "total-suspended-solids",
])
  catalog.add({
    dataset,
    aggregate: ["mean"],
    group: ["FWOA", "FWMP"],
    scenario: ["Lower", "Higher"],
    geographicUnit: ["hydro_compartment"],
    timeUnit: ["annual", "daily"],
    timeValue: allYears,
  });

for (let dataset of [
  "surge-water-surface-elevations-by-exceedance",
  "wave-heights-by-exceedance",
])
  catalog.add({
    dataset,
    aep: allAEPs,
    group: ["FWOA", "FWMP"],
    scenario: ["Lower", "Higher"],
    geographicUnit: ["hydro_compartment"],
    timeUnit: ["decadal"],
    timeValue: allDecades,
  });

for (let dataset of [
  "surge-water-surface-elevations-by-storm",
  "wave-heights-by-storm",
])
  catalog.add({
    dataset,
    group: ["FWOA", "FWMP"],
    scenario: ["Lower", "Higher"],
    geographicUnit: ["hydro_compartment"],
    storm: allStorms,
    timeUnit: ["decadal"],
    timeValue: allDecades,
  });

catalog.add({
  dataset: "exposure-asset-count",
  aep: allAEPs,
  asset: allAssets,
  exposure: allExposures,
  fragility: [0, 1],
  group: ["FWOA", "FWMP"],
  scenario: ["Lower", "Higher"],
  geographicUnit: ["clara"],
  pumping: [0, 0.5, 1],
  timeUnit: ["decadal"],
  timeValue: allDecades,
});

catalog.add({
  dataset: "exposure-critical-infrastructure-count",
  aep: allAEPs,
  category: allCategories,
  // claraGroup: allClaraGroups,
  exposure: ["Moderate Exposure", "Severe Exposure"],
  fragility: [0, 1],
  group: ["FWOA", "FWMP"],
  scenario: ["Lower", "Higher"],
  geographicUnit: ["clara"],
  pumping: [0, 0.5, 1],
  timeUnit: ["decadal"],
  timeValue: allDecades,
});

catalog.add({
  dataset: "exposure-historic-properties-count",
  aep: allAEPs,
  exposure: ["Moderate Exposure", "Severe Exposure"],
  fragility: [0, 1],
  group: ["FWOA", "FWMP"],
  scenario: ["Lower", "Higher"],
  geographicUnit: ["clara"],
  pumping: [0, 0.5, 1],
  timeUnit: ["decadal"],
  timeValue: allDecades,
});

// for (let dataset of ["land-area"])
//   catalog.add({
//     dataset,
//     group: ["FWOA", "FWMP"],
//     scenario: ["Lower", "Higher"],
//     geographicUnit: ["hydro_compartment"],
//     timeUnit: ["annual"],
//     timeValue: allYears,
//   });

for (let dataset of ["vegetation-coverage-area", "habitat-suitability-unit"])
  catalog.add({
    dataset,
    group: ["FWOA", "FWMP"],
    scenario: ["Lower", "Higher"],
    geographicUnit: ["ecoregion"],
    timeUnit: ["annual"],
    timeValue: allYears,
  });

catalog.add({
  dataset: "population",
  group: ["FWOA", "FWMP"],
  scenario: ["Lower", "Higher"],
  geographicUnit: ["parish"],
  migration: allMigrations,
  ssp: allSSPs,
  timeUnit: ["decadal"],
  timeValue: [12, 22, 32, 42, 52],
});

catalog.add({
  dataset: "population-change",
  group: ["FWOA", "FWMP"],
  scenario: ["Lower", "Higher"],
  geographicUnit: ["block_group"],
  migration: allMigrations,
  ssp: allSSPs,
  timeUnit: ["decadal"],
  timeValue: [12, 22, 32, 42, 52],
});
