import { h } from "preact";
import { datasetsMap } from "../helpers/dataset";

import { Map } from "../components/map";
import Sidebar from "../components/sidebar";

const Dataset = ({ datasetId }) => {
  const dataset = datasetsMap[datasetId];
  return (
    <>
      <div class="row">
        <div class="col-lg-3">
          <Sidebar />
        </div>
        <div class="col-lg-9">
          <h2 class="mb-3">{dataset.title}</h2>
          <Map />
        </div>
      </div>
    </>
  );
};

export default Dataset;
