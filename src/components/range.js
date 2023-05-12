import { h } from "preact";
import { useId } from "preact/hooks";
import style from "./range.css";
import { useSignal } from "@preact/signals";

export default function Range({ choices, level, setValue, value }) {
  const id = useId();
  const idx = useSignal(choices.indexOf(value));
  const update = () => setValue(choices[idx.value]);

  const tickDivisor = choices.length > 10 ? 10 : 1;
  const filteredYears = choices.filter((val) => val % tickDivisor === 0);
  const ticks = filteredYears.map((val, i) => (
    <span
      key={val}
      class={style.tick}
      style={{ left: `${(i * 100) / (filteredYears.length - 1)}%` }}
    >
      {val}
    </span>
  ));

  return (
    <div class={`mb-3 d-flex ${style.range}`}>
      <label for={id} class="form-label me-3">
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
