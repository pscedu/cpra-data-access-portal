import { useContext } from "preact/hooks";
import { catalog } from "../helpers/catalog";
import { State } from "../helpers/state";
import style from "./legend.module.css";
import { useSignal } from "@preact/signals";

// Map legend.
const Legend = () => {
  const { aggregate, dataset } = useContext(State);
  const expanded = useSignal(true);
  if (!dataset.value || !dataset.value.legend) return;

  const items = dataset.value.legend.map(([color, label]) => (
    <li class={style.item} key={label}>
      <span
        class={style.symbol}
        style={{
          backgroundColor: color,
          border: `1px solid ${
            color == "#00000000" ? "#dddddd" : "transparent"
          }`,
        }}
      />
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
        {aggregate.value !== undefined
          ? `Annual ${catalog.format(aggregate.value, "aggregate")} `
          : ""}
        {dataset.value.title}
        {dataset.value.unit ? ` (${dataset.value.unit})` : ""}
      </button>
      {expanded.value ? <ul class={style.items}>{items}</ul> : null}
    </section>
  );
};

export default Legend;
