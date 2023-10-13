import { useId } from "preact/hooks";
import { catalog } from "../helpers/catalog";

export default function Select({ choices, level, setValue, value }) {
  const id = useId();
  // Create option elements from the choices array.
  const options = choices.map((val) => {
    return (
      <option key={val} value={val}>
        {catalog.format(val, level.prop)}
      </option>
    );
  });

  return (
    <div class="mb-3">
      <label for={id} class="form-label">
        {level.name}
      </label>
      <select
        key={level.prop}
        id={id}
        class="form-select form-select-sm"
        aria-label={level.name}
        disabled={options.length === 1}
        onChange={(e) => setValue(e.target.value)}
        value={value}
      >
        {options}
      </select>
    </div>
  );
}
