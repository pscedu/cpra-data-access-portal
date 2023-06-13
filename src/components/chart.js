import { h } from "preact";
import { useContext } from "preact/hooks";
import { State } from "../helpers/state";

import LineChart from "./line-chart";

const timeUnitLabels = {
  day: "Daily",
  decade: "Decadal",
  year: "Annual",
};

const Chart = () => {
  const { dataset, geographies, geographicUnit, timeUnit } = useContext(State);
  if (geographicUnit.value == "undefined") return;

  return (
    <>
      <h3>
        {timeUnitLabels[timeUnit.value]} {dataset.value.title}
      </h3>
      {geographies.value.length > 0 ? (
        <LineChart />
      ) : (
        <div
          class={
            "card text-bg-light fs-4 text-dark d-flex " +
            "justify-content-center text-center"
          }
          style={{ height: "400px", padding: "10% 20%" }}
        >
          Select at least one {geographicUnit.value} on the map to view the time
          series chart.
        </div>
      )}
    </>
  );
};

export default Chart;
