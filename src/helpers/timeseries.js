import { catalogSchema as levels } from "./catalog";

const authToken = "52b47e72e8100e63452242ae5317ed188b2082ee";
const baseUrl = "https://mpdv-23.dev.bridges2.psc.edu/api/timeseries";
const timeUnits = {
  day: "daily",
  year: "annual",
  decade: "decadal",
};

export async function getData(route, scenario) {
  const { geographicUnit, timeUnit } = scenario;
  const url = `${baseUrl}/${geographicUnit}/${timeUnits[timeUnit]}/${route}/`;
  const params = new URLSearchParams({
    scenario_model_groups: ["scenario", "group"]
      .map((prop) =>
        parseInt(scenario[prop].replace(/[^0-9]/, ""), 10).toString()
      )
      .join("_"),
    year: 50,
  });
  for (let level of levels) {
    let value = scenario[level.prop];
    if (level.param && value !== "undefined") params.append(level.param, value);
  }
  console.log(`${url}?${params}`);
  const res = await fetch(`${url}?${params}`, {
    headers: {
      Authorization: `Token ${authToken}`,
    },
  });
  console.log(await res.json());
}
