import { h } from "preact";
import { useContext } from "preact/hooks";
import { State } from "../helpers/state";
import { catalog } from "../helpers/catalog";
import { datasetsMap } from "../helpers/dataset";

import DownloadButtons from "./download-buttons";
import NoDataMessage from "./no-data-message";

function labeledCount(items, label, suffix = "s") {
  return `${items.length} ${
    items.length == 1 ? label : label.replace(/y$/, "ie") + suffix
  }`;
}

const Download = () => {
  const { dataset, geographies, geographicUnit, scenarios } = useContext(State);
  const isVector = geographicUnit.value !== undefined;
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
    summary = `${labeledCount(scenarios.value, "scenario")}; year ${
      scenarios.value[0].timeValue
    }`;
    if (isVector) {
      summary += `; ${labeledCount(
        geographies.value,
        `selected ${catalog
          .format(geographicUnit.value, "geographicUnit")
          .toLowerCase()}`
      )}`;
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
      <div class="card-body d-lg-flex justify-content-between align-items-center">
        <div class="mb-3 mb-lg-0">
          <strong>Download Data:</strong> {summary}
        </div>
        <div class="d-grid gap-2 d-lg-flex">{buttons}</div>
      </div>
    </div>
  ) : null;
};

export default Download;
