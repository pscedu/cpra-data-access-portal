import { h } from "preact";
import { useContext } from "preact/hooks";
import { State } from "../helpers/state";
import { getLevel } from "../helpers/catalog";

import LineChart from "./line-chart";
import NoDataMessage from "./no-data-message";

const timeUnitLabels = {
  day: "Daily",
  decade: "Decadal",
  year: "Annual",
};

const Chart = () => {
  const { aggregate, dataset, geographies, geographicUnit, timeUnit } =
    useContext(State);
  if (geographicUnit.value == "undefined") return;

  const formatAggregate = getLevel("aggregate").format;

  return (
    <>
      <h2 class="mt-1">
        {timeUnitLabels[timeUnit.value]} {formatAggregate(aggregate.value)}{" "}
        {dataset.value.title}
      </h2>
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
          <NoDataMessage /> on the map to view the time series chart.
        </div>
      )}
    </>
  );
};

export default Chart;
