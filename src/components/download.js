import { h } from "preact";
import { useContext } from "preact/hooks";
import { State } from "../helpers/state";
import { getLevel } from "../helpers/catalog";

import { Dropdown } from "react-bootstrap";

function labeledCount(items, label, suffix = "s") {
  return `${items.length} ${label}${items.length == 1 ? "" : suffix}`;
}

const Download = () => {
  const { dataset, geographies, geographicUnit, scenarios } = useContext(State);
  const formatUnit = getLevel("geographicUnit").format;
  const isVector = geographicUnit.value !== "undefined";

  let summary = labeledCount(scenarios.value, "scenario");
  if (isVector) {
    summary += `, ${labeledCount(
      geographies.value,
      `selected ${formatUnit(geographicUnit.value).toLowerCase()}`
    )}`;
  }

  const downloadFormats = dataset.value.fileFormats.filter(
    (format) => format.getUrl !== undefined
  );
  const disabled = geographies.value.length == 0;
  const buttons = downloadFormats.map((format) => (
    <a
      key={format.id}
      href={
        disabled
          ? null
          : format.getUrl(dataset.value, scenarios.value, geographies.value)
      }
      class={`btn btn-primary ms-2 ${disabled ? "disabled" : ""}`}
      aria-disabled={disabled}
    >
      {format.icon ? (
        <>
          <i class={`bi bi-${format.icon}`} />
        </>
      ) : null}{" "}
      {format.title}
    </a>
  ));

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

  if (isVector)
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
          <i class="bi bi-geo" /> Geographies
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="#">GeoPackage</Dropdown.Item>
          <Dropdown.Item href="#">FileGDB</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );

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
