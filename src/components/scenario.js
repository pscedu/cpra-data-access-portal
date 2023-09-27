import { h } from "preact";
import { scenarioName } from "../helpers/utils";

import Options from "./options";

export default function Scenario({ deleteScenario, scenario, scenarioIdx }) {
  return (
    <div class="card mb-3">
      <div class="card-header d-flex justify-content-between">
        <h2 class="fs-5 mb-0">{scenarioName(scenario)}</h2>
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
          scenario={scenario}
          scenarioIdx={scenarioIdx}
        />
      </div>
    </div>
  );
}
