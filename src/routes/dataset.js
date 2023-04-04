import { h } from "preact";
import { datasetsMap } from "../helpers/config";

import Sidebar from "../components/sidebar";

const Dataset = ({ datasetId }) => {
  const spec = datasetsMap[datasetId];
  return (
    <>
      <div class="row">
        <div class="col-lg-3">
          <Sidebar datasetSpec={spec} />
        </div>
        <div class="col-lg-9">
          <h2>{spec.title}</h2>
        </div>
      </div>
    </>
  );
};

export default Dataset;
