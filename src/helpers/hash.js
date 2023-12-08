import { catalog } from "./catalog";

const hashLevels = catalog.schema.filter(
  (level) => level.scope == "global" && level.hash
);

const getHashParams = () =>
  new URLSearchParams(window.location.hash.replace(/^#/, ""));

export const readHash = () => {
  const params = getHashParams();
  const scenario = {};
  for (let level of hashLevels)
    if (params.has(level.hash)) scenario[level.prop] = params.get(level.hash);

  let scenarios = [scenario];
  if (params.has("scenario"))
    scenarios = params
      .get("scenario")
      .split("-")
      .map((sid) => ({ sid, ...scenario }));

  let geographies = [];
  if (params.has("selected"))
    geographies = params
      .get("selected")
      .split("-")
      .map((geo) =>
        ["ecoregion", "extraction_point"].includes(scenario.geographicUnit)
          ? geo
          : parseInt(geo, 10)
      );

  let chartRange = [2, 52];
  if (params.has("chart"))
    chartRange = params
      .get("chart")
      .split(/(?<!^)(?<!-)-/)
      .map((val) => parseFloat(val));

  return { scenarios, geographies, chartRange };
};

export const writeHash = (scenarios, geographies, chartRange) => {
  const params = getHashParams();
  const firstScenario = scenarios[0];
  for (let level of hashLevels)
    if (level.prop in firstScenario)
      params.set(level.hash, firstScenario[level.prop].toString());
  if (firstScenario.dataset != "")
    params.set("scenario", scenarios.map(({ sid }) => sid).join("-"));

  geographies && geographies.length
    ? params.set("selected", geographies.map((geo) => geo.toString()).join("-"))
    : params.delete("selected");

  chartRange && chartRange.length
    ? params.set(
        "chart",
        chartRange
          .map((val) =>
            val.toLocaleString("en-US", {
              maximumFractionDigits: 3,
              useGrouping: false,
            })
          )
          .join("-")
      )
    : params.delete("chart");

  let hashString = params.toString();
  // Fix encoding of map parameter.
  if (params.has("map"))
    hashString = hashString.replace(
      /(^|&)map=[^&]+/,
      `$1map=${params.get("map")}`
    );
  window.history.replaceState(
    window.history.state,
    "",
    hashString ? `#${hashString}` : ""
  );
};
