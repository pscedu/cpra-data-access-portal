import { useContext, useLayoutEffect } from "preact/hooks";
import { State } from "../helpers/state";
import { getParentGeographies } from "../helpers/geography";

export default function ContextMenu() {
  const { contextMenu, geographies } = useContext(State);
  const closeMenu = () => (contextMenu.value = null);

  useLayoutEffect(() => {
    document.body.addEventListener("click", closeMenu);
    document.body.addEventListener("contextmenu", closeMenu);
  });

  const spec = contextMenu.value;
  if (!spec) return;

  if (spec.type == "geography-select") {
    const parents = getParentGeographies(spec.feature);

    if (parents.length)
      return (
        <ul
          class="dropdown-menu show"
          style={{ position: "fixed", left: `${spec.x}px`, top: `${spec.y}px` }}
        >
          {parents.map(({ ids, name, type }) => (
            <li key={type}>
              <a
                class="dropdown-item"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  geographies.value = ids;
                }}
              >
                Select {type} {name}
              </a>
            </li>
          ))}
        </ul>
      );
  }
}
