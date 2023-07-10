import { h } from "preact";
import { datasets } from "../helpers/dataset";

import Columns from "../components/layout";
import Tile from "../components/tile";

const Home = () => {
  const tiles = datasets
    .filter((spec) => spec.featured)
    .map((spec) => Tile({ spec }));
  const rows = datasets
    .filter((spec) => spec.static)
    .map((spec) => {
      const buttons = spec.fileFormats.map((format, i) => (
        <a
          class="btn btn-secondary btn-sm me-2"
          key={format.id}
          href={spec.urls[i]}
        >
          <i class={`bi bi-${format.icon || "download"}`} /> {format.title}
        </a>
      ));
      return (
        <tr key={spec.id}>
          <td>{spec.title}</td>
          <td>{buttons}</td>
        </tr>
      );
    });
  return (
    <>
      <Columns items={tiles} />
      <h2 class="text-uppercase mt-4">Reference Data</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Available Formats</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </>
  );
};

export default Home;
