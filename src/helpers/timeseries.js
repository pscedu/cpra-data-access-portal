import { catalog } from "./catalog";
import { datasetsMap } from "./dataset";

const authToken = "52b47e72e8100e63452242ae5317ed188b2082ee";
const baseUrl = "https://api.mpdap.coastal.la.gov";

export function getTimeseriesURL(route, scenarios, geographies, format) {
  const firstScenario = scenarios[0];
  const routePostfix =
    firstScenario.aggregate !== undefined ? `_${firstScenario.aggregate}` : "";
  const url = `${baseUrl}/${firstScenario.geographicUnit}/${firstScenario.timeUnit}/${route}${routePostfix}/`;
  const dataset = datasetsMap[firstScenario.dataset];
  let filename = dataset.id;

  const filters = {};
  if (geographies) {
    filters.geography = geographies;
  } else {
    filters.elapsed_year = firstScenario.timeValue.toString();
  }

  const seen = [];
  filters.scenarios = scenarios
    .filter((scenario) => {
      const scenarioString = JSON.stringify({
        ...scenario,
        updateChart: undefined,
        updateStyle: undefined,
      });
      if (!seen.includes(scenarioString)) return seen.push(scenarioString);
    })
    .map((scenario) => {
      // filename += `-${scenario.sid}`;
      const result = {};
      for (let level of catalog.schema) {
        let value = scenario[level.prop];
        if (level.param && value !== undefined)
          result[level.param] = value.toString();
      }
      return result;
    });
  if (!(format == "csv")) console.log(JSON.stringify(filters));
  const params = new URLSearchParams({ filters: JSON.stringify(filters) });
  if (format) params.set("format", format);
  if (format == "csv") {
    if (filters.elapsed_year)
      filename += `-${filters.elapsed_year.padStart(2, "0")}`;
    params.set("filename", filename);
  }
  return `${url}?${params}`;
}

export async function getTimeseriesData(route, scenarios, geographies) {
  const url = getTimeseriesURL(route, scenarios, geographies);
  console.log(url);
  const res = await fetch(url, {
    // headers: {
    //   Authorization: `Token ${authToken}`,
    // },
  });
  const data = await res.json();
  const headers = data.data.shift();
  const excluded = [
    "value",
    "value_05",
    "value_10",
    "value_50",
    "value_90",
    "value_95",
    "elapsed_year",
    "geography",
  ];
  const signature = (values, propMap = {}) =>
    JSON.stringify(
      headers
        .filter((h) => !excluded.includes(h))
        .map((h) => values[propMap[h] || h].toString())
    );
  const scenarioSignatures = scenarios.map((scenario) =>
    signature(scenario, catalog.params)
  );
  // console.log("scenario signatures", scenarioSignatures);

  const result = [];
  const hasGeographies = geographies && geographies.length;
  for (let i = 0; i < scenarios.length; i++) {
    result[i] = [];
    if (hasGeographies)
      for (let g = 0; g < geographies.length; g++) result[i].push([]);
  }

  let unmatchedRows = [];
  for (let row of data.data) {
    let rowObj = {};
    for (let i in headers) rowObj[headers[i]] = row[i];
    let rowSignature = signature(rowObj);
    // console.log("row", rowSignature, rowObj);
    let rowMatched = false;
    for (let i in scenarioSignatures)
      if (rowSignature == scenarioSignatures[i]) {
        rowMatched = true;
        if (hasGeographies) {
          result[i][geographies.indexOf(rowObj.geography)].push(rowObj);
        } else {
          result[i].push(rowObj);
        }
      }
    if (!rowMatched) unmatchedRows.push(rowObj);
  }

  if (unmatchedRows.length)
    console.warn(
      `API response contained ${unmatchedRows.length} rows` +
        " that did not match a scenario",
      unmatchedRows
    );

  return result;
}
