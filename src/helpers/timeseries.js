import { catalogSchema as levels, paramMap } from "./catalog";

const authToken = "52b47e72e8100e63452242ae5317ed188b2082ee";
const baseUrl = "https://vm007.bridges2.psc.edu";
const timeUnits = {
  day: "daily",
  year: "annual",
  decade: "decadal",
};

export function getTimeseriesURL(route, scenarios, geographies, format) {
  const firstScenario = scenarios[0];
  const url = `${baseUrl}/${firstScenario.geographicUnit}/${
    timeUnits[firstScenario.timeUnit]
  }/${route}/`;

  const filters = {};
  if (geographies) {
    filters.geography = geographies;
  } else {
    filters.elapsed_time = firstScenario.timeValue.toString();
  }

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
      const result = {};
      for (let level of levels) {
        let value = scenario[level.prop];
        if (level.param && value !== "undefined")
          result[level.param] = value.toString();
      }
      return result;
    });
  console.log(JSON.stringify(filters));
  const params = new URLSearchParams({ filters: JSON.stringify(filters) });
  if (format) params.set("format", format);
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
    "value_min",
    "value_q1",
    "value_median",
    "value_q3",
    "value_max",
    "elapsed_time",
    "geography",
  ];
  const signature = (values, propMap = {}) =>
    JSON.stringify(
      headers
        .filter((h) => !excluded.includes(h))
        .map((h) => values[propMap[h] || h])
    );
  const scenarioSignatures = scenarios.map((scenario) =>
    signature(scenario, paramMap)
  );

  const result = [];
  const hasGeographies = geographies && geographies.length;
  for (let i = 0; i < scenarios.length; i++) {
    result[i] = [];
    if (hasGeographies)
      for (let g = 0; g < geographies.length; g++) result[i].push([]);
  }

  console.log(scenarioSignatures);

  for (let row of data.data) {
    let rowObj = {};
    for (let i in headers) rowObj[headers[i]] = row[i];
    let rowSignature = signature(rowObj);
    for (let i in scenarioSignatures)
      if (rowSignature == scenarioSignatures[i]) {
        if (hasGeographies) {
          result[i][geographies.indexOf(rowObj.geography)].push(rowObj);
        } else {
          result[i].push(rowObj);
        }
      }
  }

  console.log(result);

  return result;
}
