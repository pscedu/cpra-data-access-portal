import { h } from "preact";
import { useContext } from "preact/hooks";
import { getLevel } from "../helpers/catalog";
import { State } from "../helpers/state";
import style from "./legend.css";
import { useSignal } from "@preact/signals";

const Legend = () => {
  const { aggregate, dataset } = useContext(State);
  const expanded = useSignal(true);
  if (!dataset.value || !dataset.value.legend) return;

  const formatAggregate = getLevel("aggregate").format;

  const items = dataset.value.legend.map(([color, label]) => (
    <li class={style.item} key={label}>
      <span class={style.symbol} style={{ backgroundColor: color }} />
      <span class={style.label}>{label}</span>
    </li>
  ));

  return (
    <section class={style.legend}>
      <button
        class={`font-heading text-start ${style.title}`}
        onClick={() => (expanded.value = !expanded.value)}
        title={`${expanded.value ? "Hide" : "Show"} legend`}
      >
        <i
          class={`bi bi-caret-${expanded.value ? "down" : "right"}-fill me-1`}
        />
        {aggregate.value !== "undefined"
          ? `Annual ${formatAggregate(aggregate.value)} `
          : ""}
        {dataset.value.title}
        {dataset.value.unit ? ` (${dataset.value.unit})` : ""}
      </button>
      {expanded.value ? <ul class={style.items}>{items}</ul> : null}
    </section>
  );
};

export default Legend;
