import { h } from "preact";

import Options from "./options";

export default function Scenario({
  datasetSpec,
  deleteScenario,
  entry,
  scenarioIdx,
}) {
  return (
    <div class="card mb-3">
      <div class="card-header d-flex justify-content-between">
        <h2 class="fs-5 mb-0">Scenario {scenarioIdx + 1}</h2>
        <button
          style={{ border: "0 none transparent" }}
          type="button"
          class="btn btn-sm"
          title="Delete scenario"
          onClick={deleteScenario}
          disabled={!deleteScenario}
        >
          <i class="bi bi-trash" />
        </button>
      </div>
      <div class="card-body">
        <Options
          scope="scenario"
          scenario={entry}
          datasetSpec={datasetSpec}
          scenarioIdx={scenarioIdx}
        />
      </div>
    </div>
  );
}
