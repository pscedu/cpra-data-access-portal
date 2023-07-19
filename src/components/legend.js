import { h } from "preact";
import { useContext } from "preact/hooks";
import { State } from "../helpers/state";
import style from "./legend.css";
import { useSignal } from "@preact/signals";

const Legend = () => {
  const { dataset } = useContext(State);
  const expanded = useSignal(true);
  if (!dataset.value || !dataset.value.legend) return;

  const items = dataset.value.legend.map(([color, label]) => (
    <li class={style.item} key={label}>
      <span class={style.symbol} style={{ backgroundColor: color }} />
      <span class={style.label}>{label}</span>
    </li>
  ));

  return (
    <section class={style.legend}>
      <button
        class={`font-heading ${style.title}`}
        onClick={() => (expanded.value = !expanded.value)}
      >
        <i class={`bi bi-caret-down-fill me-1`} />
        {dataset.value.title}
        {dataset.value.unit ? ` (${dataset.value.unit})` : ""}
      </button>
      {expanded.value ? <ul class={style.items}>{items}</ul> : null}
    </section>
  );
};

export default Legend;
