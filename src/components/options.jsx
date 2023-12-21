import { useContext } from "preact/hooks";
import { catalog } from "../helpers/catalog";
import { State } from "../helpers/state";

import Select from "./select";

// Display a series of select controls that update the selected scenario(s).
export default function Options({ scope, excluded = [], scenarioIdx }) {
  const { choices, scenarios, updateScenarios } = useContext(State);
  const controls = catalog.schema
    .filter((level) => level.scope == scope && !excluded.includes(level.prop))
    .map((level) => {
      const levelChoices = choices.value[scenarioIdx || 0][level.prop];
      if (levelChoices)
        return (
          <Select
            key={level.prop}
            choices={levelChoices}
            level={level}
            value={scenarios.value[scenarioIdx || 0][level.prop]}
            setValue={(value) =>
              updateScenarios({ [level.prop]: value }, scenarioIdx)
            }
          />
        );
    });

  return controls;
}
