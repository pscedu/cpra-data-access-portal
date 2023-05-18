import { h } from "preact";
import { useContext } from "preact/hooks";
import { State } from "../helpers/state";

function labeledCount(items, label, suffix = "s") {
  return `${items.length} ${label}${items.length == 1 ? "" : suffix}`;
}

const Download = () => {
  const { dataset, geographies, scenarios } = useContext(State);
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
      class={`btn btn-primary ${disabled ? "disabled" : ""}`}
      aria-disabled={disabled}
    >
      Download {format.title}
    </a>
  ));
  return downloadFormats.length ? (
    <div class="card text-bg-light mt-4">
      <div class="card-body d-flex justify-content-between align-items-center">
        <div>
          <strong>Download Data:</strong>{" "}
          {labeledCount(scenarios.value, "scenario")},{" "}
          {labeledCount(
            geographies.value,
            `selected ${scenarios.value[0].geographicUnit}`
          )}
        </div>
        <div>{buttons}</div>
      </div>
    </div>
  ) : null;
};

export default Download;
