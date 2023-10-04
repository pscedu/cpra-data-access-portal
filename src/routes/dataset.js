import { h } from "preact";
import { useContext } from "preact/hooks";
import { catalog } from "../helpers/catalog";
import { datasetsMap } from "../helpers/dataset";
import { State } from "../helpers/state";
import { scenarioName } from "../helpers/utils";
import style from "./dataset.css";

import Button from "react-bootstrap/Button";

import Chart from "../components/chart";
import Download from "../components/download";
import ExpandText from "../components/expand-text";
import GeographyButtons from "../components/geography-buttons";
import Map from "../components/map";
import Range from "../components/range";
import Sidebar from "../components/sidebar";

const Dataset = ({ datasetId }) => {
  const {
    choices,
    datasetDescriptions,
    scenarios,
    showSidebar,
    updateScenarios,
  } = useContext(State);
  const firstScenario = scenarios.value[0];
  const timeValueLevel = catalog.levels.timeValue;
  const dataset = datasetsMap[datasetId];
  const description = datasetDescriptions.value[dataset.id];
  return (
    <>
      <div class="row">
        <div class="col-lg-3">
          <Sidebar />
        </div>
        <div class="col-lg-9">
          <div class="d-flex align-items-start justify-content-between">
            <h1 class="mb-3">{dataset.title}</h1>
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
          {description ? (
            <ExpandText>
              <p dangerouslySetInnerHTML={{ __html: description }} />
            </ExpandText>
          ) : null}
          <Map />
          <div class="d-flex align-items-start justify-content-between">
            <div class={style["scenario-name"]}>
              {scenarioName(scenarios.value[0])}
            </div>
            <Range
              level={{
                ...timeValueLevel,
                name: "Elapsed Year",
              }}
              choices={choices.value[0].timeValue}
              value={firstScenario.timeValue}
              setValue={(value) => updateScenarios({ timeValue: value })}
            />
            {scenarios.value.length > 1 ? (
              <div class={style["scenario-name"]}>
                {scenarioName(scenarios.value[1])}
              </div>
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
