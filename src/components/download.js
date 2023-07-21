import { h } from "preact";
import { useContext } from "preact/hooks";
import { State } from "../helpers/state";
import { getLevel } from "../helpers/catalog";
import { datasetsMap } from "../helpers/dataset";

import DownloadButtons from "./download-buttons";
import NoDataMessage from "./no-data-message";

function labeledCount(items, label, suffix = "s") {
  return `${items.length} ${label}${items.length == 1 ? "" : suffix}`;
}

const timeValueLabel = {
  decade: "year",
};

const Download = () => {
  const { dataset, geographies, geographicUnit, timeUnit, scenarios } =
    useContext(State);
  const formatUnit = getLevel("geographicUnit").format;
  const isVector = geographicUnit.value !== "undefined";
  const buttons = [];
  const datasetButtons = DownloadButtons({
    dataset: dataset.value,
    scenarios: scenarios.value,
    geographies: geographies.value,
  });
  buttons.push(datasetButtons);

  buttons.push(<DownloadButtons dataset={datasetsMap["documentation"]} />);

  if (isVector)
    buttons.push(<DownloadButtons dataset={datasetsMap["model-geometries"]} />);

  let summary;
  if (datasetButtons) {
    summary = labeledCount(scenarios.value, "scenario");
    if (isVector) {
      summary += `, ${labeledCount(
        geographies.value,
        `selected ${formatUnit(geographicUnit.value).toLowerCase()}`
      )}`;
    } else {
      summary += `, ${timeValueLabel[timeUnit.value] || timeUnit.value} ${
        scenarios.value[0].timeValue
      }`;
    }
  } else {
    summary = (
      <>
        <NoDataMessage />.
      </>
    );
  }

  return buttons.length ? (
    <div class="card text-bg-light mt-4">
      <div class="card-body d-flex justify-content-between align-items-center">
        <div>
          <strong>Download Data:</strong> {summary}
        </div>
        <div class="d-flex">{buttons}</div>
      </div>
    </div>
  ) : null;
};

export default Download;
