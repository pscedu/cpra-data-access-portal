import { useContext, useLayoutEffect } from "preact/hooks";
import { State } from "../helpers/state";
import { getParentGeographies } from "../helpers/geography";
import ColorChooser from "./color-chooser";

export default function ContextMenu() {
  const { contextMenu, geographies } = useContext(State);
  const closeMenu = () => (contextMenu.value = null);

  useLayoutEffect(() => {
    document.body.addEventListener("click", closeMenu);
    document.body.addEventListener("contextmenu", closeMenu);
  });

  const spec = contextMenu.value;
  if (!spec) return;
  const lis = [];

  if (spec.type == "geography-select") {
    lis.push(
      <li key="color-chooser">
        <ColorChooser feature={spec.feature} />
      </li>
    );
    const parents = getParentGeographies(spec.feature);

    if (parents.length) {
      lis.push(
        <hr />,
        ...parents.map(({ childIds, name, type }) => (
          <li key={type}>
            <a
              class="dropdown-item"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                geographies.value = childIds;
              }}
            >
              Select {type} {name}
            </a>
          </li>
        ))
      );
    }
  }

  if (lis.length)
    return (
      <ul
        class="dropdown-menu show"
        style={{ position: "fixed", left: `${spec.x}px`, top: `${spec.y}px` }}
      >
        {lis}
      </ul>
    );
}
