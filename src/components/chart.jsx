import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { getApiData } from "../helpers/api";

import BoxChart from "./box-chart";
import LineChart from "./line-chart";
import NoDataMessage from "./no-data-message";
import Tooltip from "./tooltip";

const Chart = ({ choices, dataset, geographies, scenarios, spec }) => {
  const chartDatasets = useSignal([]);
  const loading = useSignal(false);

  const dataUrl = spec.getDataUrl(dataset, scenarios, geographies);

  useEffect(() => {
    (async () => {
      if (dataUrl) {
        const data = await getApiData(dataUrl);
        chartDatasets.value = spec.getChartDatasets(
          dataset,
          scenarios,
          geographies,
          spec,
          data
        );
      } else {
        chartDatasets.value = [];
      }
    })();
  }, [dataUrl]);

  const ChartComponent = {
    BoxChart: BoxChart,
    LineChart: LineChart,
  }[spec.component];

  return (
    <>
      <h2 class="mt-1">
        {spec.getTitle(dataset, scenarios, geographies)}
        <Tooltip icon="hand-index-fill">
          <strong>Interactivity Tips:</strong> Tap or click a dataset in the
          legend to toggle it on or off in the chart.{" "}
          {spec.canZoom ? (
            <>Pinch or use the mouse scroll wheel to zoom the chart.</>
          ) : null}
        </Tooltip>
        {loading.value && (
          <div
            class="spinner-border spinner-border-sm"
            role="status"
            style={{ height: "1.25rem", width: "1.25rem" }}
          >
            <span class="visually-hidden">Loading...</span>
          </div>
        )}
      </h2>
      {geographies.length > 0 ? (
        <ChartComponent
          chartDatasets={chartDatasets}
          labels={spec.getLabels ? spec.getLabels(dataset, choices) : null}
          xLabel={spec.getXLabel(dataset)}
          yLabel={spec.getYLabel(dataset)}
        />
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
