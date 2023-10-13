import { useContext } from "preact/hooks";
import { State } from "../helpers/state";

import Scenario from "./scenario";

export default function Scenarios() {
  const { addScenario, removeScenario, scenarios } = useContext(State);

  const scenarioCards = scenarios.value.map((scenario, i) => {
    return (
      <Scenario
        key={i}
        scenario={scenario}
        scenarioIdx={i}
        deleteScenario={
          scenarios.value.length > 1 ? () => removeScenario(i) : null
        }
      />
    );
  });

  return (
    <>
      {scenarioCards}
      <button
        type="button"
        class="btn btn-outline-dark"
        onClick={addScenario}
        disabled={scenarios.value.length >= 2}
      >
        Add Scenario
      </button>
    </>
  );
}
