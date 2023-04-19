import { h } from "preact";
import { useContext } from "preact/hooks";
import { State } from "../helpers/state";

import Scenario from "./scenario";
import { catalog } from "../helpers/catalog";

export default function Scenarios() {
  const { dataset, scenarios } = useContext(State);

  const addScenario = () =>
    (scenarios.value = [
      ...scenarios.value,
      catalog.match({ dataset: dataset.value.id }),
    ]);
  const removeScenario = (scenarioIdx) =>
    (scenarios.value = scenarios.value.filter((_, i) => i != scenarioIdx));

  const scenarioCards = scenarios.value.map((scenario, i) => {
    return (
      <Scenario
        key={scenario}
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
