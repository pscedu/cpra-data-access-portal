import { h } from "preact";
import { datasets } from "../helpers/dataset";

import Columns from "../components/layout";
import DownloadButtons from "../components/download-buttons";
import Tile from "../components/tile";

const Home = () => {
  const tiles = datasets
    .filter((spec) => spec.featured)
    .map((spec) => Tile({ spec }));
  const rows = datasets
    .filter((spec) => spec.static)
    .map((spec) => {
      return (
        <tr key={spec.id}>
          <td>{spec.title}</td>
          <td>{spec.description}</td>
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
      <Columns items={tiles} />
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

export default Home;
