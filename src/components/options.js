import { h } from "preact";
import { useContext } from "preact/hooks";
import { catalog, catalogSchema as levels } from "../helpers/catalog";
import { State } from "../helpers/state";

import Select from "./select";

export default function Options({
  datasetSpec,
  scope,
  excluded = [],
  scenario = {},
  scenarioIdx,
}) {
  const state = useContext(State);
  const entry = catalog.match(state.getDatasetValues(datasetSpec.id, scenario));
  const controls = levels
    .filter((level) => level.scope == scope && !excluded.includes(level.prop))
    .map((level) => {
      const choices = catalog.choices(entry, level);
      const setValue = (value) => {
        if (scope == "global") {
          state[level.prop].value = value;
        } else {
          state.scenarios.value = state.scenarios.value.map((s, i) =>
            i == scenarioIdx ? { ...s, [level.prop]: value } : s
          );
        }
      };
      if (!(choices.length == 1 && choices[0] == "undefined"))
        return (
          <Select
            key={level.prop}
            choices={choices}
            level={level}
            value={entry[level.prop]}
            setValue={setValue}
          />
        );
    });

  return controls;
}
