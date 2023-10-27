import { catalog } from "./catalog";

const authToken = "52b47e72e8100e63452242ae5317ed188b2082ee";
const baseUrl = "https://api.mpdap.coastal.la.gov";

export function getApiUrl({
  dataset,
  format = null,
  geographies = [],
  scenarios,
  wildcardProp = "timeUnit",
}) {
  if (!dataset || !dataset.route) return null;
  const firstScenario = scenarios[0];
  const routePostfix =
    firstScenario.aggregate !== undefined ? `_${firstScenario.aggregate}` : "";
  const url = `${baseUrl}/${firstScenario.geographicUnit}/${firstScenario.timeUnit}/${dataset.route}${routePostfix}/`;
  let filename = dataset.id;

  const filters = {};
  if (geographies.length) filters.geography = geographies;
  if (!geographies.length || wildcardProp != "timeUnit")
    filters.elapsed_year = firstScenario.timeValue.toString();

  const seen = [];
  filters.scenarios = scenarios
    .filter((scenario) => {
      const scenarioString = JSON.stringify({
        ...scenario,
        updateStyle: undefined,
      });
      if (!seen.includes(scenarioString)) return seen.push(scenarioString);
    })
    .map((scenario) => {
      filename += `-${scenario.sid}`;
      const result = {};
      for (let level of catalog.schema) {
        let value = scenario[level.prop];
        if (level.prop != wildcardProp && level.param && value !== undefined)
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

async function fetchApiJson(url) {
  const res = await fetch(url, {
    // headers: {
    //   Authorization: `Token ${authToken}`,
    // },
  });
  return await res.json();
}

async function parseApiUrl(url) {
  const params = new URL(url).searchParams;
  return JSON.parse(params.get("filters"));
}

export async function getApiData(url) {
  console.log(url);
  const [data, parsed] = await Promise.all([
    fetchApiJson(url),
    parseApiUrl(url),
  ]);
  const { geography, scenarios } = parsed;
  const headers = data.data.shift();

  const signature = (values) =>
    JSON.stringify(
      headers.filter((h) => h in scenarios[0]).map((h) => values[h].toString())
    );
  const scenarioSignatures = scenarios.map((scenario) => signature(scenario));
  // console.log("scenario signatures", scenarioSignatures);

  const result = [];
  const hasGeographies = geography && geography.length;
  for (let i = 0; i < scenarios.length; i++) {
    result[i] = [];
    if (hasGeographies)
      for (let g = 0; g < geography.length; g++) result[i].push([]);
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
          result[i][geography.indexOf(rowObj.geography)].push(rowObj);
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
