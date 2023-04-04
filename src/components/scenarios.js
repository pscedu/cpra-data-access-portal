import { h } from "preact";
import { useContext } from "preact/hooks";
import { catalog } from "../helpers/catalog";
import { State } from "../helpers/state";

import Scenario from "./scenario";

export default function Scenarios({ datasetSpec }) {
  const { getDatasetValues, scenarios } = useContext(State);

  return scenarios.value.map((scenario, i) => {
    const entry = catalog.match(getDatasetValues(datasetSpec.id, scenario));
    return (
      <Scenario
        key={scenario}
        datasetSpec={datasetSpec}
        entry={entry}
        scenarioIdx={i}
      />
    );
  });
}
