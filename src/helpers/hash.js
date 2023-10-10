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
  if (params.has("scenario"))
    return params
      .get("scenario")
      .split("-")
      .map((sid) => ({ sid, ...scenario }));
  return [scenario];
};

export const writeHash = (scenarios) => {
  const params = getHashParams();
  const firstScenario = scenarios[0];
  for (let level of hashLevels)
    if (level.prop in firstScenario)
      params.set(level.hash, firstScenario[level.prop].toString());
  if (firstScenario.dataset != "")
    params.set("scenario", scenarios.map(({ sid }) => sid).join("-"));

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
