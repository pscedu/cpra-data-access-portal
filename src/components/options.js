import { h } from "preact";
import { useContext } from "preact/hooks";
import { catalog, catalogSchema as levels } from "../helpers/catalog";
import { State } from "../helpers/state";

import Select from "./select";

export default function Options({ datasetSpec }) {
  const state = useContext(State);
  const entry = catalog.match(state.getCurrentEntry(datasetSpec.id));
  const controls = levels.slice(1, levels.length - 1).map((level) => {
    const choices = catalog.choices(entry, level);
    if (!(choices.length == 1 && choices[0] == "undefined"))
      return (
        <Select
          key={level.prop}
          choices={choices}
          level={level}
          value={entry[level.prop]}
          setValue={(value) => (state[level.prop].value = value)}
        />
      );
  });

  return controls;
}
