import { h } from "preact";
import { useContext } from "preact/hooks";
import { State } from "../helpers/state";
import { catalog } from "../helpers/catalog";

import BoxChart from "./box-chart";
import LineChart from "./line-chart";
import NoDataMessage from "./no-data-message";
import Tooltip from "./tooltip";

const getChartType = (type) =>
  ({
    box: BoxChart,
    line: LineChart,
  }[type] || LineChart);

const timeUnitLabels = {
  daily: "Daily",
  decadal: "Decadal",
  annual: "Annual",
};

const Chart = () => {
  const {
    aggregate,
    chartDatasetsLoading,
    dataset,
    geographies,
    geographicUnit,
    timeUnit,
  } = useContext(State);
  if (!geographicUnit.value) return;

  const ChartType = getChartType((dataset.value.chartType || {}).id);

  return (
    <>
      <h2 class="mt-1">
        {timeUnitLabels[timeUnit.value]}{" "}
        {catalog.format(aggregate.value, "aggregate")} {dataset.value.title}
        <Tooltip icon="hand-index-fill">
          <strong>Interactivity Tips:</strong> Tap or click a dataset in the
          legend to toggle it on or off in the chart.{" "}
          {(dataset.value.chartType || {}).id !== "box" ? (
            <>Pinch or use the mouse scroll wheel to zoom the chart.</>
          ) : null}
        </Tooltip>
        {chartDatasetsLoading.value ? (
          <div
            class="spinner-border spinner-border-sm"
            role="status"
            style={{ height: "1.25rem", width: "1.25rem" }}
          >
            <span class="visually-hidden">Loading...</span>
          </div>
        ) : null}
      </h2>
      {geographies.value.length > 0 ? (
        <ChartType />
      ) : (
        <div
          class={
            "card text-bg-light fs-4 text-dark d-flex " +
            "justify-content-center text-center"
          }
          style={{ height: "400px", padding: "10% 20%" }}
        >
          <NoDataMessage /> on the map to view or download time series data.
        </div>
      )}
    </>
  );
};

export default Chart;
