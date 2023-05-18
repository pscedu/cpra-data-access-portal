import { catalogSchema as levels } from "./catalog";

const authToken = "52b47e72e8100e63452242ae5317ed188b2082ee";
const baseUrl = "https://vm007.bridges2.psc.edu";
const timeUnits = {
  day: "daily",
  year: "annual",
  decade: "decadal",
};

export function getTimeseriesURL(route, scenarios, geographies) {
  const firstScenario = scenarios[0];
  const url = `${baseUrl}/${firstScenario.geographicUnit}/${
    timeUnits[firstScenario.timeUnit]
  }/${route}/`;

  const filters = {};
  if (geographies) {
    filters.geographies = geographies;
  } else {
    filters[firstScenario.timeUnit == "day" ? "day" : "year"] =
      firstScenario.timeValue.toString();
  }

  const seen = [];
  filters.scenarios = scenarios
    .filter((scenario) => {
      const scenarioString = JSON.stringify(scenario);
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
  return `${url}?${new URLSearchParams({ filters: JSON.stringify(filters) })}`;
}

export async function getTimeseriesData(route, scenarios) {
  const url = getTimeseriesURL(route, scenarios);
  console.log(url);
  const res = await fetch(url, {
    // headers: {
    //   Authorization: `Token ${authToken}`,
    // },
  });
  const data = await res.json();
  const headers = data.data
    .shift()
    .map((h) => (h == "modelgroup" ? "group" : h));
  const excluded = ["geoid", "value", "min", "q1", "median", "q3", "max"];
  const signature = (values, propMap = {}) =>
    JSON.stringify(
      headers
        .filter((h) => !excluded.includes(h))
        .map((h) => values[propMap[h] || h])
    );
  const scenarioSignatures = scenarios.map((scenario) =>
    signature(scenario, { day: "timeValue", year: "timeValue" })
  );

  const result = [];
  for (let i = 0; i < scenarios.length; i++) result[i] = [];
  for (let row of data.data) {
    let rowObj = {};
    for (let i in headers) rowObj[headers[i]] = row[i];
    let rowSignature = signature(rowObj);
    for (let i in scenarioSignatures)
      if (rowSignature == scenarioSignatures[i]) result[i].push(rowObj);
  }

  return result;
}
