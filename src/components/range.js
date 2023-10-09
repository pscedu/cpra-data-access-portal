import { h } from "preact";
import { useId } from "preact/hooks";
import style from "./range.css";
import { useSignal } from "@preact/signals";

export default function Range({ choices, level, setValue, value }) {
  const id = useId();
  const idx = useSignal(choices.indexOf(value));
  const update = () => setValue(choices[idx.value]);

  const filteredYears = choices.filter((val) =>
    choices.length > 10 ? val % 10 === 2 : true
  );
  const min = Math.min(...choices);
  const max = Math.max(...choices);
  const ticks = filteredYears.map((val) => (
    <span
      key={val}
      class={style.tick}
      style={{ left: `${(100 * (val - min)) / (max - min)}%` }}
    >
      {val}
    </span>
  ));

  return (
    <div class={`mb-3 d-md-flex align-items-center ${style.range}`}>
      <label for={id} class="form-label me-3 text-nowrap pt-md-3">
        {level.name}: <strong>{choices[idx.value]}</strong>
      </label>
      <div class={style["range-container"]}>
        <div class={style.ticks}>{ticks}</div>
        <input
          type="range"
          class="form-range"
          key={level.prop}
          id={id}
          aria-label={level.name}
          disabled={choices.length < 2}
          onMouseUp={update}
          onTouchEnd={update}
          onKeyUp={update}
          onInput={(e) => (idx.value = parseInt(e.target.value, 10))}
          value={idx.value}
          min={0}
          max={choices.length - 1}
        />
      </div>
    </div>
  );
}
