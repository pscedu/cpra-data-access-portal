import { h } from "preact";
import { useContext } from "preact/hooks";
import { catalog, catalogSchema as levels } from "../helpers/catalog";
import { State } from "../helpers/state";

import Select from "./select";

export default function Options({
  scope,
  excluded = [],
  scenario = {},
  scenarioIdx,
}) {
  const { scenarios } = useContext(State);
  const controls = levels
    .filter((level) => level.scope == scope && !excluded.includes(level.prop))
    .map((level) => {
      const choices = catalog.choices(scenario, level);
      const setValue = (value) => {
        scenarios.value = scenarios.value.map((scenario, i) =>
          scope == "global" || i == scenarioIdx
            ? catalog.match({ ...scenario, [level.prop]: value })
            : scenario
        );
      };
      if (!(choices.length == 1 && choices[0] == "undefined"))
        return (
          <Select
            key={level.prop}
            choices={choices}
            level={level}
            value={scenario[level.prop]}
            setValue={setValue}
          />
        );
    });

  return controls;
}
