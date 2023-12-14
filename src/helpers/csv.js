/**
 * Create a CSV from an array of rows, and trigger download in the browser.
 * @param {string[][]} rows - Array of row arrays.
 * @param {string} filename - Default filename.
 */
export function downloadCsv(rows, filename) {
  const blob = new Blob([rows.map((row) => row.join(",")).join("\n")], {
    type: "text/csv",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  a.click();
}
