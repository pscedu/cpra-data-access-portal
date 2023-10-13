import { useContext } from "preact/hooks";
import { State } from "../helpers/state";

export default function GeographyButtons() {
  const { geographies, geographicUnit } = useContext(State);
  const isVector = geographicUnit.value !== undefined;
  const buttons = [];

  if (isVector)
    buttons.push(
      <button
        type="button"
        class="btn btn-outline-dark ms-2"
        onClick={() => (geographies.value = [])}
        disabled={geographies.value.length == 0}
        title="Clear Selection"
        aria-label="Clear Selection"
      >
        <i class="bi bi-trash" />
        <span class="d-none d-lg-inline ms-1">Clear Selection</span>
      </button>
    );

  return buttons;
}
