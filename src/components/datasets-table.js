import { h } from "preact";
import { catalog, getLevel } from "../helpers/catalog";
import { datasets } from "../helpers/dataset";

const DatasetsTable = () => {
  const filteredDatasets = datasets.filter((spec) => !spec.static && spec.id);
  filteredDatasets.sort((a, b) => (a.title > b.title ? 1 : -1));

  const geographicUnit = getLevel("geographicUnit");
  const timeUnit = getLevel("timeUnit");

  const rows = filteredDatasets.map(({ fileFormats, id, title, unit }) => {
    const { choices } = catalog.select({ dataset: id });
    const formats = new Set(
      fileFormats.map((format) => format.abbreviation || format.title)
    );
    return (
      <tr key={id}>
        <td>
          <strong>
            <a href={`/dataset/${id}`}>{title}</a>
          </strong>
        </td>
        <td>{unit || "-"}</td>
        <td>
          {choices.geographicUnit.map(geographicUnit.format).join(", ") || "-"}
        </td>
        <td>{choices.timeUnit.map(timeUnit.format).join(", ") || "-"}</td>
        <td>
          {Array.from(formats).map((format) => (
            <span
              key={format}
              class={`badge rounded-pill me-1 format-${format.toLowerCase()}`}
            >
              {format}
            </span>
          ))}
        </td>
      </tr>
    );
  });

  return (
    <>
      <h2 class="mt-4">Master Plan Data</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Dataset</th>
            <th>Units</th>
            <th>{geographicUnit.name}</th>
            <th>{timeUnit.name}</th>
            <th>File Format</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </>
  );
};

export default DatasetsTable;
