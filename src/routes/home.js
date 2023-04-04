import { h } from "preact";
import { datasets } from "../helpers/dataset";

import Columns from "../components/layout";
import Tile from "../components/tile";

const Home = () => {
  const tiles = datasets
    .filter((spec) => spec.featured)
    .map((spec) => Tile({ spec }));
  return <>{<Columns items={tiles} />}</>;
};

export default Home;
