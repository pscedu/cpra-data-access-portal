import { useContext, useId } from "preact/hooks";
import { useLocation } from "preact-iso";
import { State } from "../helpers/state";
import { catalog } from "../helpers/catalog";
import { datasets } from "../helpers/dataset";

// Menu to choose a different dataset from the dataset page.
export default function DatasetSwitcher() {
  const { dataset, geographicUnit } = useContext(State);
  const { route } = useLocation();
  const id = useId();

  const filteredDatasets = datasets.filter((spec) => !spec.static && spec.id);
  filteredDatasets.sort((a, b) => (a.title > b.title ? 1 : -1));

  const sameOptions = [];
  const otherOptions = [];

  filteredDatasets.forEach((d) => {
    const { choices } = catalog.select({ dataset: d.id });
    ("geographicUnit" in choices &&
    choices.geographicUnit.includes(geographicUnit.value)
      ? sameOptions
      : otherOptions
    ).push(
      <option value={d.id} selected={d == dataset.value}>
        {d.title}
      </option>
    );
  });

  return (
    <div class="mb-3">
      <label for={id} class="form-label">
        Dataset
      </label>
      <select
        class="form-select form-select-lg mb-3"
        id={id}
        onChange={(e) => route(`/dataset/${e.target.value}`)}
      >
        {sameOptions.length ? (
          <>
            <optgroup
              label={`By ${catalog.format(
                geographicUnit.value,
                "geographicUnit"
              )}`}
            >
              {sameOptions}
            </optgroup>
            <optgroup label="By Other Geographies">{otherOptions}</optgroup>
          </>
        ) : (
          otherOptions
        )}
      </select>
    </div>
  );
}
