import { h } from "preact";
import { useContext } from "preact/hooks";
import { catalog } from "../helpers/catalog";
import { State } from "../helpers/state";

import Scenario from "./scenario";

export default function Scenarios({ datasetSpec }) {
  const { getDatasetValues, scenarios } = useContext(State);

  const addScenario = () => (scenarios.value = [...scenarios.value, {}]);
  const removeScenario = (scenarioIdx) =>
    (scenarios.value = scenarios.value.filter((_, i) => i != scenarioIdx));

  const scenarioCards = scenarios.value.map((scenario, i) => {
    const entry = catalog.match(getDatasetValues(datasetSpec.id, scenario));
    return (
      <Scenario
        key={scenario}
        datasetSpec={datasetSpec}
        entry={entry}
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
