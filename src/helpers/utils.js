/**
 * Create an index object.
 * @param {Object[]} items - Objects to index.
 * @param {string} key - Key name to index on.
 * @returns {Object} - Index object.
 */
export const toObject = (items, key = "id") => {
  const obj = {};
  for (let item of items) obj[item[key]] = item;
  return obj;
};

/**
 * Format a scenario name for display.
 * @param {Object} scenario - Scenario object.
 * @param {boolean} [short] - Use the short format without the word "scenario"?
 * @returns {string} - Scenario name.
 */
export const scenarioName = (scenario, short) =>
  `${short ? "" : "Scenario "}${scenario.sid}`;

/**
 * Compare function to sort items in descending order
 * @param {*} a - First item.
 * @param {*} b - Second item
 * @returns {number} - Sort order.
 */
export const sortDesc = (a, b) => (a < b ? 1 : -1);

// Dataset colors.
export const datasetColors = [
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

/**
 * Adjust a color by changing its luminosity.
 * @param {string} color - Hexadecimal color code.
 * @param {number} amount - Value to add to the red, green, and blue channels.
 * @returns {string} - Hexadecimal representation of the adjusted color.
 */
export const adjustColor = (color, amount) =>
  `#${color.replace(/../g, (color) =>
    `0${Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(
      16
    )}`.substr(-2)
  )}`;

/**
 * Get the color for a dataset.
 * @param {number} i - Dataset index.
 * @param {number} adjustment - Luminosity adjustment.
 * @returns
 */
export const getDatasetColor = (i, adjustment) =>
  adjustColor(datasetColors[i] || "000000", adjustment || 0);

/**
 * Convert a hexadecimal color to RGBA with the given alpha value.
 * @param {string} hexColor - Hexadecimal color code.
 * @param {number} alpha - Opacity from 0 to 1.
 * @returns {string} - RGBA color.
 */
export const toRGBA = (hexColor, alpha) => {
  const colors = hexColor
    .match(/[0-9A-Za-z]{2}/g)
    .map((hex) => parseInt(hex, 16));
  return `rgba(${colors.join(", ")}, ${alpha})`;
};

/**
 * Format a number using metric abbreviations.
 * @param {number} value - Value to display.
 * @returns {string} - Formatted number string.
 */
export const formatNumber = (value) => {
  let power = 0;
  while (value / Math.pow(1000, power) >= 1000) power += 1;
  const suffix = ["", "K", "M", "B", "T", "Q"][power];
  return `${(value / Math.pow(1000, power)).toPrecision(3)}${suffix}`;
};
