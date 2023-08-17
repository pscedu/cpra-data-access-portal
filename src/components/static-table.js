import { h } from "preact";
import { useContext } from "preact/hooks";
import { State } from "../helpers/state";
import { datasets } from "../helpers/dataset";

import DownloadButtons from "../components/download-buttons";

const StaticTable = () => {
  const { datasetDescriptions } = useContext(State);
  const rows = datasets
    .filter((spec) => spec.static)
    .map((spec) => {
      const description =
        spec.description ||
        (datasetDescriptions.value[spec.id] || "").replace(/^(.+?\.).+$/, "$1");
      return (
        <tr key={spec.id}>
          <td>
            <strong>{spec.title}</strong>
          </td>
          <td dangerouslySetInnerHTML={{ __html: description }} />
          <td>
            <div class="d-grid gap-2">
              <DownloadButtons
                dataset={spec}
                dropdown={false}
                classes="btn-sm ms-0"
              />
            </div>
          </td>
        </tr>
      );
    });
  return (
    <>
      <h2 class="mt-4">Reference Files</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </>
  );
};

export default StaticTable;
