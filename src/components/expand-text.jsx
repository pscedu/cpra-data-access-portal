import { useSignal } from "@preact/signals";
import style from "./expand-text.module.css";

// Expand/contract control for displaying abbreviated text with the option to view more.
export default function ExpandText({ children }) {
  const expanded = useSignal(false);

  return (
    <div
      class={`${style.expander} ${
        expanded.value ? style.expanded : style.contracted
      }`}
    >
      {children}
      <button
        class="ps-1 font-heading"
        onClick={() => (expanded.value = !expanded.value)}
      >
        <i class={`bi bi-caret-${expanded.value ? "up" : "left"}-fill me-1`} />
        {expanded.value ? "Less" : "More"}
      </button>
    </div>
  );
}
