import { h } from "preact";
import { datasets } from "../helpers/dataset";

import Columns from "../components/layout";
import DatasetsTable from "../components/datasets-table";
import StaticTable from "../components/static-table";
import Tile from "../components/tile";

const Home = () => {
  const tiles = datasets
    .filter((spec) => spec.featured)
    .map((spec) => Tile({ spec }));
  return (
    <>
      <Columns columns={3} items={tiles} />
      <DatasetsTable />
      <StaticTable />
    </>
  );
};

export default Home;
