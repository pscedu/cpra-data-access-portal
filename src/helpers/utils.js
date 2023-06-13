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
export const getDatasetColor = (i) =>
  `#${datasetColors[i % datasetColors.length]}`;
