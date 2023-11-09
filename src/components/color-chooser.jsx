import { useContext } from "preact/hooks";
import { State } from "../helpers/state";
import { datasetColors } from "../helpers/utils";

export default function ColorChooser({ feature }) {
  const { geographies } = useContext(State);
  const isSelected = geographies.value.includes(feature.id);

  const makeButton = (background, colorIdx, selected) => (
    <button
      disabled={selected}
      onClick={() => {
        if (!isSelected) geographies.value.push(feature.id);
        const currentIdx = geographies.value.indexOf(feature.id);
        const currentId = geographies.value[colorIdx];
        geographies.value = geographies.value.map((id, i) =>
          i == colorIdx ? feature.id : i == currentIdx ? currentId : id
        );
      }}
      style={{
        background,
        border: `${selected ? "3px" : "1px"} solid ${
          selected ? "black" : "#dddddd"
        }`,
        marginRight: "5px",
        height: "20px",
        width: "20px",
      }}
    ></button>
  );

  const buttons = datasetColors
    .slice(0, geographies.value.length + (isSelected ? 0 : 1))
    .map((color, i) =>
      makeButton(`#${color}`, i, geographies.value[i] == feature.id)
    );
  return <span class="d-block ms-3 me-3 mb-2">{buttons}</span>;
}
