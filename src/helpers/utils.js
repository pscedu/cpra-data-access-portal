export const toObject = (items, key = "id") => {
  const obj = {};
  for (let item of items) obj[item[key]] = item;
  return obj;
};

// Get scenario name from index.
export const scenarioName = (scenarioIdx, short) =>
  `${short ? "" : "Scenario "}${"ABCDEFGHIJKLMNOPQRSTUVWXYZ"[scenarioIdx]}`;

// Descending sort function for catalog levels.
export const sortDesc = (a, b) => (a < b ? 1 : -1);
export const sortAsc = (a, b) => (a > b ? 1 : -1);

// Dataset colors.
const datasetColors = [
  "ff0000",
  "0aefff",
  "ffd300",
  "be0aff",
  "0aff99",
  "580aff",
  "deff0a",
  "ff8700",
  "a1ff0a",
  "147df5",
];
export const adjustColor = (color, amount) =>
  `#${color.replace(/../g, (color) =>
    `0${Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(
      16
    )}`.substr(-2)
  )}`;

export const getDatasetColor = (i, adjustment) =>
  adjustColor(datasetColors[i % datasetColors.length], adjustment || 0);

export const toRGBA = (hexColor, alpha) => {
  const colors = hexColor
    .match(/[0-9A-Za-z]{2}/g)
    .map((hex) => parseInt(hex, 16));
  return `rgba(${colors.join(", ")}, ${alpha})`;
};

export const formatNumber = (value) => {
  let power = 0;
  while (value / Math.pow(1000, power) >= 1000) power += 1;
  const suffix = ["", "K", "M", "B", "T", "Q"][power];
  return `${(value / Math.pow(1000, power)).toPrecision(3)}${suffix}`;
};
