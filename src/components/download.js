import { h } from "preact";
import { useContext } from "preact/hooks";
import { State } from "../helpers/state";
import { getLevel } from "../helpers/catalog";
import { datasetsMap } from "../helpers/dataset";
import { scenarioName } from "../helpers/utils";

import { Dropdown } from "react-bootstrap";
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

  const downloadOptions = [];
  for (let fileFormat of dataset.value.fileFormats) {
    if (!fileFormat.getUrls) continue;
    let urls = Array.from(
      new Set(
        fileFormat.getUrls(dataset.value, scenarios.value, geographies.value)
      )
    );
    for (let urlIdx in urls) {
      let url = urls[urlIdx];
      downloadOptions.push([
        url,
        <span key={url}>
          {fileFormat.icon ? <i class={`bi bi-${fileFormat.icon}`} /> : null}{" "}
          {fileFormat.title}{" "}
          {urls.length > 1 ? scenarioName(urlIdx, true) : null}
        </span>,
      ]);
    }
  }

  const buttons = [];

  if (downloadOptions.length == 1) {
    let url = downloadOptions[0][0];
    buttons.push(
      <a key={url} href={url} class={`btn btn-primary ms-2`}>
        {downloadOptions[0][1]}
      </a>
    );
  } else if (downloadOptions.length > 1) {
    let items = downloadOptions.map(([url, content]) => (
      <Dropdown.Item key={url} href={url}>
        {content}
      </Dropdown.Item>
    ));
    buttons.push(
      <Dropdown className="ms-2">
        <Dropdown.Toggle
          variant="primary"
          id="data-download"
          title={"Download this dataset."}
        >
          <i class="bi bi-download" /> Data
        </Dropdown.Toggle>
        <Dropdown.Menu>{items}</Dropdown.Menu>
      </Dropdown>
    );
  }

  buttons.push(
    <a
      key="metadata"
      href="#"
      class="btn btn-secondary ms-2"
      title="Download a metadata file, including a data dictionary."
    >
      <i class="bi bi-filetype-txt" /> Metadata
    </a>
  );

  if (isVector) {
    const geomsDataset = datasetsMap["model-geometries"];
    const geomsItems = geomsDataset.fileFormats.map((format, i) => (
      <Dropdown.Item key={format.id} href={geomsDataset.urls[i]}>
        {format.title}
      </Dropdown.Item>
    ));
    buttons.push(
      <Dropdown className="ms-2">
        <Dropdown.Toggle
          variant="secondary"
          id="geography-download"
          title={
            "Download spatial data for ecoregions, hydro compartments, " +
            "CLARA communities, and extractions points."
          }
        >
          <i class="bi bi-geo" /> Model Geometries
        </Dropdown.Toggle>
        <Dropdown.Menu>{geomsItems}</Dropdown.Menu>
      </Dropdown>
    );
  }

  let summary;
  if (downloadOptions.length) {
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
