import { h } from "preact";
import { useContext } from "preact/hooks";
import { getLevel } from "../helpers/catalog";
import { datasetsMap } from "../helpers/dataset";
import { State } from "../helpers/state";

import Map from "../components/map";
import Range from "../components/range";
import Sidebar from "../components/sidebar";

const Dataset = ({ datasetId }) => {
  const { choices, scenarios, updateScenarios } = useContext(State);
  const firstScenario = scenarios.value[0];
  const timeValueLevel = getLevel("timeValue");
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
          <Range
            level={timeValueLevel}
            choices={choices.value[0].timeValue}
            value={firstScenario.timeValue}
            setValue={(value) => updateScenarios({ timeValue: value })}
          />
        </div>
      </div>
    </>
  );
};

export default Dataset;
