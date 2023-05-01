import { h } from "preact";
import { useId } from "preact/hooks";

export default function Range({ choices, level, setValue, value }) {
  const id = useId();
  return (
    <div class="mb-3">
      <label for={id} class="form-label">
        {level.name}
      </label>
      <input
        type="range"
        key={level.prop}
        id={id}
        aria-label={level.name}
        disabled={choices.length < 2}
        onInput={(e) => setValue(choices[parseInt(e.target.value, 10)])}
        value={choices.indexOf(value)}
        min={0}
        max={choices.length - 1}
      />
    </div>
  );
}
