import { h } from "preact";
import { useContext } from "preact/hooks";
import { getLevel } from "../helpers/catalog";
import { datasetsMap } from "../helpers/dataset";
import { State } from "../helpers/state";
import style from "./dataset.css";

import Button from "react-bootstrap/Button";

import Chart from "../components/chart";
import Download from "../components/download";
import GeographyButtons from "../components/geography-buttons";
import Map from "../components/map";
import Range from "../components/range";
import Sidebar from "../components/sidebar";

const Dataset = ({ datasetId }) => {
  const { choices, scenarios, showSidebar, updateScenarios } =
    useContext(State);
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
          <div class="d-flex align-items-start justify-content-between">
            <h2 class="mb-3">{dataset.title}</h2>
            <div class="d-flex justify-content-between">
              <Button
                variant="outline-dark"
                className="d-lg-none ms-2"
                onClick={() => (showSidebar.value = true)}
                title="Show dataset options"
              >
                <i class="bi bi-tools" />
              </Button>
              <GeographyButtons />
            </div>
          </div>
          <Map />
          <div class="d-flex align-items-start justify-content-between">
            <div class={style["scenario-name"]}>Scenario A</div>
            <Range
              level={{
                ...timeValueLevel,
                name: firstScenario.timeUnit == "day" ? "Day" : "Year",
              }}
              choices={choices.value[0].timeValue}
              value={firstScenario.timeValue}
              setValue={(value) => updateScenarios({ timeValue: value })}
            />
            {scenarios.value.length > 1 ? (
              <div class={style["scenario-name"]}>Scenario B</div>
            ) : (
              <div class={style["no-scenario-name"]} />
            )}
          </div>
          <Chart />
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <Download />
        </div>
      </div>
    </>
  );
};

export default Dataset;
