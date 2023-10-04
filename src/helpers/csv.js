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
