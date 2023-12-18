const all = {};
const allDecades = ["2", "12", "22", "32", "42", "52"];

// Catalog level definition objects.
const schema = [
  {
    prop: "dataset",
    name: "Dataset",
    values: [
      "",
      "annual-exceedance-damages-dollars",
      "expected-annual-damages-dollars",
      "expected-annual-structural-damage",
      "exposure-asset-count",
      "exposure-critical-infrastructure-count",
      "exposure-historic-properties-count",
      "flood-depth",
      "land-change",
      "nonstructural-expected-annual-damage-dollars",
      "nonstructural-expected-annual-structural-damage",
      "population-change",
      "population",
      "salinity",
      "surge-water-surface-elevations-by-exceedance",
      "surge-water-surface-elevations-by-storm",
      "temperature",
      "total-suspended-solids",
      "vegetation-coverage-area",
      "vegetation-type-ffibs",
      "vegetation-type-vct",
      "water-level-variability",
      "water-level",
      "wave-heights-by-exceedance",
      "wave-heights-by-storm",
    ],
  },
  {
    prop: "geographicUnit",
    name: "Geography",
    hash: "geography",
    scope: "global",
    values: [
      "block_group",
      "clara",
      "ecoregion",
      "extraction_point",
      "hydro_compartment",
      "parish",
    ],
    labels: [
      "Census Block Group",
      "Clara Community",
      "Ecoregion",
      "Extraction Point",
      "Hydro Compartment",
      "Parish",
    ],
  },
  {
    prop: "aggregate",
    name: "Aggregate",
    hash: "aggregate",
    scope: "global",
    values: ["mean", "two_week_max"],
    labels: ["Mean", "2 Week Max"],
  },
  {
    prop: "timeUnit",
    name: "Time Unit",
    hash: "time",
    scope: "global",
    values: ["annual", "daily", "decadal"],
    labels: ["Annual", "Daily", "Decadal"],
  },
  {
    prop: "group",
    param: "model_group_name",
    name: "Plan Implementation Scenario",
    scope: "scenario",
    values: ["FWOA", "FWMP"],
    labels: ["Without Plan (FWOA)", "With Plan (FWMP)"],
  },
  {
    prop: "scenario",
    param: "scenario_name",
    name: "Environmental Scenario",
    scope: "scenario",
    values: ["Lower", "Higher"],
  },
  {
    prop: "aep",
    param: "aep",
    name: "Annual Exceedance Probability",
    scope: "scenario",
    values: ["10", "2", "1", "0.2"],
    labels: ["10.0", "2.0", "1.0", "0.2"],
  },
  {
    prop: "storm",
    param: "storm_id",
    name: "Synthetic Storm ID",
    scope: "scenario",
    values: [
      "66",
      "68",
      "80",
      "82",
      "83",
      "87",
      "141",
      "148",
      "164",
      "165",
      "171",
      "172",
      "178",
      "180",
      "181",
      "190",
      "242",
      "248",
      "253",
      "255",
      "257",
      "263",
      "268",
      "270",
      "276",
      "277",
      "278",
      "281",
      "283",
      "285",
      "288",
      "289",
      "290",
      "292",
      "296",
      "297",
      "298",
      "299",
      "304",
      "312",
      "347",
      "349",
      "355",
      "358",
      "364",
      "365",
      "367",
      "372",
      "373",
      "374",
      "382",
      "388",
      "391",
      "394",
      "395",
      "396",
      "397",
      "405",
      "413",
      "422",
      "439",
      "440",
      "466",
      "471",
      "474",
      "479",
      "480",
      "482",
      "486",
      "488",
      "494",
      "500",
      "505",
      "509",
      "516",
      "524",
      "528",
      "529",
      "530",
      "550",
      "560",
      "567",
      "573",
      "575",
      "576",
      "583",
      "584",
      "590",
      "606",
      "609",
    ],
  },
  {
    prop: "pumping",
    param: "pumping_id",
    name: "Pumping Scenario",
    scope: "scenario",
    values: ["0", "0.5", "1"],
    labels: ["No Pumping", "50% Pumping Capacity", "Full Pumping Capacity"],
  },
  {
    prop: "fragility",
    param: "fragility_scenario",
    name: "Fragility Scenario",
    scope: "scenario",
    values: ["0", "1"],
    labels: ["No Fragility", "IPET Fragility"],
  },
  {
    prop: "asset",
    param: "asset_type",
    name: "Asset Type",
    scope: "scenario",
    values: ["6", "1", "2", "3", "4", "5"],
    labels: [
      "All Asset Types",
      "Small Residential (single-family, manufactured homes, or duplex)",
      "Other Multi-family Residential",
      "Commercial, Industrial, or Agricultural",
      "Other Structural (public, education, or religion)",
      "Non-structural (crops, vehicles, or roads)",
    ],
  },
  {
    prop: "category",
    param: "category",
    name: "Category",
    scope: "scenario",
    values: [
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
    ],
  },
  {
    prop: "exposure",
    param: "exposure_type",
    name: "Exposure Type",
    scope: "scenario",
    values: ["Exposure", "Moderate Exposure", "Severe Exposure"],
  },
  {
    prop: "nsProject",
    param: "ns_project_id",
    name: "Nonstructural Project",
    scope: "scenario",
    values: ["1", "3"],
  },
  {
    prop: "participation",
    param: "participation_rate",
    name: "Participation Rate",
    scope: "scenario",
    values: ["0.5", "0.75", "1"],
    labels: ["50% Participation", "75% Participation", "Full Participation"],
  },
  {
    prop: "migration",
    param: "migration",
    name: "Migration",
    scope: "scenario",
    values: ["BASE", "MIG"],
  },
  {
    prop: "ssp",
    param: "ssp",
    name: "Shared Socioeconomic Pathway",
    scope: "scenario",
    values: ["1", "2", "3", "4", "5"],
  },
  {
    prop: "vegetation",
    param: "vegetation_code",
    name: "Vegetation Type",
    scope: "scenario",
    values: ["BRM", "FOR", "FRM", "INM", "SAM", "UPL", "WAT"],
    labels: [
      "Brackish Marsh",
      "Fresh Forest",
      "Fresh Marsh",
      "Intermediate Marsh",
      "Saline Marsh",
      "Upland",
      "Water",
    ],
  },
  {
    prop: "timeValue",
    name: "Time Value",
    hash: "year",
    scope: "global",
    values: [...Array(51).keys()].map((i) => (i + 2).toString()),
  },
];

// Scenarios definitions. These objects are used to assign letters to all possible
// combinations of variables. They are defined separately from the entries below
// so that they remain consistent even if the entries change.
const scenarios = [
  {
    group: all,
    scenario: all,
  },
  {
    group: all,
    scenario: all,
    aep: all,
  },
  {
    group: all,
    scenario: all,
    storm: all,
  },
  {
    group: all,
    scenario: all,
    vegetation: all,
  },
  {
    group: all,
    scenario: all,
    migration: all,
    ssp: all,
  },
  {
    group: all,
    scenario: all,
    pumping: all,
    fragility: all,
    asset: all,
  },
  {
    group: all,
    scenario: all,
    aep: all,
    pumping: all,
    fragility: all,
    asset: all,
  },
  {
    group: all,
    scenario: all,
    aep: all,
    pumping: all,
    fragility: all,
    exposure: all,
  },
  {
    group: all,
    scenario: all,
    aep: all,
    pumping: all,
    fragility: all,
    asset: all,
    exposure: all,
  },
  {
    group: all,
    scenario: all,
    aep: all,
    pumping: all,
    fragility: all,
    category: all,
    exposure: all,
  },
  {
    group: all,
    scenario: all,
    pumping: all,
    fragility: all,
    asset: all,
    nsProject: all,
    participation: all,
  },
];

// Catalog entries. They determine which combinations of choices are available in
// the catalog.
const entries = [
  {
    dataset: "",
  },
  {
    dataset: ["land-change", "vegetation-type-ffibs"],
    group: all,
    scenario: all,
    timeUnit: ["annual"],
    timeValue: all,
  },
  {
    dataset: "vegetation-type-vct",
    group: all,
    scenario: all,
    timeUnit: ["decadal"],
    timeValue: allDecades,
  },
  {
    dataset: "flood-depth",
    group: all,
    scenario: all,
    timeUnit: ["decadal"],
    aep: all,
    timeValue: ["3", "12", "22", "32", "42", "52"],
  },
  {
    dataset: [
      "expected-annual-damages-dollars",
      "expected-annual-structural-damage",
    ],
    asset: all,
    fragility: all,
    group: ["FWOA"],
    scenario: all,
    geographicUnit: ["clara"],
    pumping: all,
    timeUnit: ["decadal"],
    timeValue: allDecades,
  },
  {
    dataset: [
      "expected-annual-damages-dollars",
      "expected-annual-structural-damage",
    ],
    asset: all,
    fragility: all,
    group: ["FWMP"],
    scenario: all,
    geographicUnit: ["clara"],
    pumping: ["0.5"],
    timeUnit: ["decadal"],
    timeValue: allDecades,
  },
  {
    dataset: [
      "nonstructural-expected-annual-damage-dollars",
      "nonstructural-expected-annual-structural-damage",
    ],
    asset: all,
    fragility: all,
    group: ["FWOA"],
    scenario: all,
    geographicUnit: ["clara"],
    nsProject: all,
    participation: all,
    pumping: all,
    timeUnit: ["decadal"],
    timeValue: allDecades,
  },
  {
    dataset: [
      "nonstructural-expected-annual-damage-dollars",
      "nonstructural-expected-annual-structural-damage",
    ],
    asset: all,
    fragility: [1],
    group: ["FWMP"],
    scenario: all,
    geographicUnit: ["clara"],
    nsProject: all,
    participation: ["1"],
    pumping: ["0.5"],
    timeUnit: ["decadal"],
    timeValue: ["2", "22", "52"],
  },
  {
    dataset: ["annual-exceedance-damages-dollars"],
    aep: all,
    asset: all,
    fragility: all,
    group: ["FWOA"],
    scenario: all,
    geographicUnit: ["clara"],
    pumping: all,
    timeUnit: ["decadal"],
    timeValue: allDecades,
  },
  {
    dataset: ["annual-exceedance-damages-dollars"],
    aep: all,
    asset: all,
    fragility: all,
    group: ["FWMP"],
    scenario: all,
    geographicUnit: ["clara"],
    pumping: ["0.5"],
    timeUnit: ["decadal"],
    timeValue: allDecades,
  },
  {
    dataset: "salinity",
    aggregate: ["mean", "two_week_max"],
    group: all,
    scenario: all,
    geographicUnit: ["hydro_compartment", "extraction_point"],
    timeUnit: ["annual"],
    timeValue: all,
  },
  {
    dataset: ["salinity", "temperature"],
    aggregate: ["mean"],
    group: all,
    scenario: all,
    geographicUnit: ["hydro_compartment"],
    timeUnit: ["daily"],
    timeValue: all,
  },
  {
    dataset: ["water-level", "water-level-variability"],
    aggregate: ["mean"],
    group: all,
    scenario: all,
    geographicUnit: ["hydro_compartment", "extraction_point"],
    timeUnit: ["annual", "daily"],
    timeValue: all,
  },
  {
    dataset: "total-suspended-solids",
    aggregate: ["mean"],
    group: all,
    scenario: all,
    geographicUnit: ["hydro_compartment"],
    timeUnit: ["annual", "daily"],
    timeValue: all,
  },
  {
    dataset: [
      "surge-water-surface-elevations-by-exceedance",
      "wave-heights-by-exceedance",
    ],
    aep: all,
    group: all,
    scenario: all,
    geographicUnit: ["hydro_compartment"],
    timeUnit: ["decadal"],
    timeValue: allDecades,
  },
  {
    dataset: [
      "surge-water-surface-elevations-by-storm",
      "wave-heights-by-storm",
    ],
    group: all,
    scenario: all,
    geographicUnit: ["hydro_compartment"],
    storm: all,
    timeUnit: ["decadal"],
    timeValue: allDecades,
  },
  {
    dataset: "exposure-asset-count",
    aep: all,
    asset: all,
    exposure: all,
    fragility: all,
    group: all,
    scenario: all,
    geographicUnit: ["clara"],
    pumping: all,
    timeUnit: ["decadal"],
    timeValue: allDecades,
  },
  {
    dataset: "exposure-critical-infrastructure-count",
    aep: all,
    category: all,
    exposure: ["Moderate Exposure", "Severe Exposure"],
    fragility: all,
    group: all,
    scenario: all,
    geographicUnit: ["clara"],
    pumping: all,
    timeUnit: ["decadal"],
    timeValue: allDecades,
  },
  {
    dataset: "exposure-historic-properties-count",
    aep: all,
    exposure: ["Moderate Exposure", "Severe Exposure"],
    fragility: all,
    group: all,
    scenario: all,
    geographicUnit: ["clara"],
    pumping: all,
    timeUnit: ["decadal"],
    timeValue: allDecades,
  },
  {
    dataset: "vegetation-coverage-area",
    group: all,
    scenario: all,
    geographicUnit: ["ecoregion"],
    timeUnit: ["annual"],
    timeValue: [...Array(50).keys()].map((i) => (i + 3).toString()),
    vegetation: all,
  },
  {
    dataset: "population",
    group: all,
    scenario: all,
    geographicUnit: ["parish"],
    migration: all,
    ssp: all,
    timeUnit: ["decadal"],
    timeValue: ["12", "22", "32", "42", "52"],
  },
  {
    dataset: "population-change",
    group: all,
    scenario: all,
    geographicUnit: ["block_group"],
    migration: all,
    ssp: all,
    timeUnit: ["decadal"],
    timeValue: ["12", "22", "32", "42", "52"],
  },
  {
    dataset: "inundation-depth",
    aggregate: ["mean"],
    group: all,
    scenario: all,
    geographicUnit: ["extraction_point"],
    timeUnit: ["annual"],
    timeValue: all,
  },
  {
    dataset: [
      "elevation",
      "mineral-deposition",
      "mineral-accretion",
      "organic-accumulation",
      "organic-accretion",
      "deep-subsidence",
      "shallow-subsidence",
      "land-type",
      "ffibs-score",
    ],
    group: all,
    scenario: all,
    geographicUnit: ["extraction_point"],
    timeUnit: ["annual"],
    timeValue: all,
  },
];

const params = {};
for (let level of schema) if (level.param) params[level.param] = level.prop;

const levels = {};
for (let level of schema) levels[level.prop] = level;

// Create an array of scenario-scope property names.
const scenarioProps = schema
  .filter(({ scope }) => scope == "scenario")
  .map(({ prop }) => prop);

// Create a reversed version of scenario-scope property names.
const scenarioPropsReverse = scenarioProps.slice().reverse();

/**
 * Get the possible values for a property from a catalog entry. This function allows
 * us to use the "all" constant in entries instead of listing all the values.
 * @param {Object} entry - Catalog entry object.
 * @param {string} prop - Property name.
 * @returns {*[]} - Array of possible values for the given property.
 */
const getValues = (entry, prop) => {
  const value = entry[prop];
  if (value === undefined) return [];
  if (value == all) return levels[prop].values;
  return Array.isArray(value) ? value : [value];
};

/**
 * Convert a scenario number to the corresponding alphabetical characters. Basically,
 * convert the number to base 26, and use A-Z as the digits.
 * @param {number} num - Number to convert.
 * @param {number} chars - Length of the full character set.
 * @param {number} offset - Character number of the first character in the set (A).
 * @returns {string} - Alphabetical representation of the number.
 */
const toAlpha = (num, chars = 26, offset = "A".charCodeAt(0)) => {
  let result = "";
  let quotient = num;
  while (quotient >= 0) {
    result = String.fromCharCode((quotient % chars) + offset) + result;
    quotient = Math.trunc(quotient / chars);
    if (quotient == 0) break;
  }
  return result;
};

/**
 * Convert a base-26 alphabetical representation of a scenario to the corresponding
 * decimal number.
 * @param {string} value - Alphabetical
 * @param {number} chars - Length of the full character set.
 * @param {number} offset - Character number of the first character in the set (A).
 * @returns {number} - Scenario number.
 */
const fromAlpha = (value, chars = 26, offset = "A".charCodeAt(0)) => {
  let result = 0;
  let str = value.trim();
  for (let i in str)
    result +=
      Math.pow(chars, str.length - i - 1) * (str.charCodeAt(i) - offset);
  return result;
};

/**
 * Look up the scenario ID for a scenario object.
 * @param {Object} scenario - Scenario object.
 * @returns {string} - Alphabetical scenario ID.
 */
const getSid = (scenario) => {
  let sid = 0;
  // Iterate ove the scenario specification objects.
  for (let i in scenarios) {
    let spec = scenarios[i];
    // Check to see if all the keys in the scenario match the keys in the spec. If so,
    // we have a potential match.
    let match =
      Object.keys(spec).length ==
      Object.keys(scenario).filter((key) => scenarioProps.includes(key)).length;
    // Collect the number of possible combinations after the matching combination.
    let after = [1];
    // Collect the indexes of the scenario value for this property.
    let idxs = [];
    for (let prop of scenarioPropsReverse) {
      let values = getValues(spec, prop);
      let value = scenario[prop];
      after.push(after[after.length - 1] * (values.length || 1));
      if (match) {
        // Make sure that the property value did actually match one of the possible
        // values for this spec property.
        let idx =
          values.length == 0 && value === undefined ? 0 : values.indexOf(value);
        if (idx == -1) match = false;
        else idxs.push(idx);
      }
    }
    // If we found a match, calculate the scenario ID. Otherwise, add the total number
    // of combinations for this spec to the scenario ID.
    if (match) {
      sid += idxs.reduce((sum, idx, i) => sum + idx * after[i], 0);
      break;
    } else {
      sid += after[after.length - 1];
    }
  }
  return toAlpha(sid);
};

/**
 * Build a scenario based on its scenario ID.
 * @param {string} sid - Scenario ID.
 * @returns {Object} - Scenario object.
 */
const selectSid = (sid) => {
  let offset = fromAlpha(sid);
  let entry = {};
  for (let i in scenarios) {
    let spec = scenarios[i];
    let after = [1];
    // Calculate the number of possible combinations for this spec.
    for (let prop of scenarioPropsReverse) {
      let values = getValues(spec, prop);
      after.push(after[after.length - 1] * (values.length || 1));
    }
    // If the total combinations for this spec is less than the remaining offset,
    // subtract it from the offset and move on to the next spec.
    const scenarioTotal = after.pop();
    if (scenarioTotal <= offset) {
      offset -= scenarioTotal;
      continue;
    }
    // Iterate over the properties, and assign values to the scenario object.
    after.reverse();
    for (let p in scenarioProps) {
      let prop = scenarioProps[p];
      if (prop in spec) {
        let propAfter = after[p];
        let propIdx = Math.floor(offset / propAfter);
        entry[prop] = getValues(spec, prop)[propIdx];
        offset = offset % propAfter;
      }
    }
    break;
  }
  return entry;
};

/**
 * Select a scenario from the catalog.
 * @param {Object} options - Options object containing the desired property values.
 * @returns {Object} - Results object containing the selected scenario and choices.
 */
const select = (options = {}) => {
  if (options.sid) options = { ...selectSid(options.sid), ...options };
  let candidates = [...entries];
  const scenario = {};
  const choices = {};

  for (let { prop, values } of schema) {
    // Filter values to available choices.
    const propChoices = values.filter((value) => {
      for (let candidate of candidates)
        if (getValues(candidate, prop).includes(value)) return true;
    });
    if (propChoices.length) choices[prop] = propChoices;

    // Try the option value and choices in order until candidates are found.
    let choiceCandidates = [];
    if (prop in options) choiceCandidates.push(options[prop]);
    choiceCandidates.push(propChoices[0]);
    for (let choice of choiceCandidates) {
      let filtered = candidates.filter((candidate) =>
        getValues(candidate, prop).includes(choice)
      );
      if (filtered.length) {
        candidates = filtered;
        if (choice !== undefined) scenario[prop] = choice;
        break;
      }
    }
  }

  scenario.sid = getSid(scenario);

  return { scenario, choices };
};

/**
 * Format a property value for display.
 * @param {*} value - Value to format.
 * @param {string} prop - Property ID.
 * @returns
 */
const format = (value, prop) => {
  const { values, labels } = levels[prop];
  return labels ? labels[values.indexOf(value)] : value;
};

/**
 * List all possible scenarios. This function is used in the CSV export of scenarios.
 * @returns {*[][]} - Array of row arrays containing scenario properties.
 */
const listScenarios = () => {
  let sid = 0;
  const rows = [["id", ...scenarioProps.map((prop) => levels[prop].param)]];
  const add = (scenario, propIdx = 0, current = []) => {
    const prop = scenarioProps[propIdx];
    if (!prop) return rows.push([toAlpha(sid++), ...current]);

    const values = getValues(scenario, prop);
    if (values.length) {
      for (let value of values) add(scenario, propIdx + 1, [...current, value]);
    } else {
      add(scenario, propIdx + 1, [...current, ""]);
    }
  };

  for (let scenario of scenarios) add(scenario);

  return rows;
};

export const catalog = {
  format,
  levels,
  listScenarios,
  params,
  schema,
  select,
};
