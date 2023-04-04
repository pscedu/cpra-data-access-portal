import { h } from "preact";

import Options from "./options";

export default function Scenario({ datasetSpec, entry, scenarioIdx }) {
  return (
    <div class="card">
      <div class="card-header">
        <h2 class="fs-5 mb-0">Scenario {scenarioIdx + 1}</h2>
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
