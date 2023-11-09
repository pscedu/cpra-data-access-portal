import { useContext, useEffect, useLayoutEffect, useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip as ChartJSTooltip,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import {
  BoxAndWiskers,
  BoxPlotController,
} from "@sgratzl/chartjs-chart-boxplot";
import { getApiData } from "../helpers/api";
import { State } from "../helpers/state";

import { AepBoxChart } from "../helpers/charts/aep-box";
import { BoxChart } from "../helpers/charts/box";
import { LineChart } from "../helpers/charts/line";

import ExpandText from "./expand-text";
import NoDataMessage from "./no-data-message";
import Tooltip from "./tooltip";

// Register the Chart.js components used in the visualization.
ChartJS.register(
  BoxAndWiskers,
  BoxPlotController,
  CategoryScale,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  ChartJSTooltip,
  zoomPlugin
);

const Chart = ({ chartType }) => {
  const { choices, dataset, datasetDescriptions, geographies, scenarios } =
    useContext(State);
  const apiData = useSignal(null);
  const loading = useSignal(false);
  const container = useRef(null);
  const chart = useRef(null);

  const chartClass = {
    "aep-box": AepBoxChart,
    box: BoxChart,
    line: LineChart,
  }[chartType];
  const spec = new chartClass({
    choices: choices.value,
    dataset: dataset.value,
    datasetDescriptions: datasetDescriptions.value,
    geographies: geographies.value,
    scenarios: scenarios.value,
  });

  const dataUrl = spec.getUrl(dataset, scenarios, geographies);
  const showChart = geographies.value.length > 0;
  const description = spec.getDescription();

  const updateChart = ({
    animation = undefined,
    updateData = true,
    updateOptions = false,
  } = {}) => {
    if (updateData) {
      // Cache the old datasets. For datasets that are remaining in the chart,
      // the object reference needs to stay the same. Otherwise the animation
      // won't work correctly.
      const oldDatasets = chart.current.data.datasets;
      const oldDatasetsMap = {};
      for (let oldDataset of chart.current.data.datasets)
        oldDatasetsMap[oldDataset.label] = oldDataset;
      oldDatasets.length = 0;

      if (apiData.value) {
        chart.current.data = spec.getData(apiData.value, chart.current);
        const newDatasets = chart.current.data.datasets;
        chart.current.data.datasets = oldDatasets;
        for (let chartDataset of newDatasets) {
          let newDataset = oldDatasetsMap[chartDataset.label] || {};
          for (let key of Object.keys(chartDataset))
            newDataset[key] = chartDataset[key];
          chart.current.data.datasets.push(newDataset);
        }
      }
    }

    if (updateOptions) chart.current.options = spec.getOptions(updateChart);

    chart.current.stop();
    chart.current.update(animation);
  };

  const destroyChart = () => {
    if (chart.current) chart.current.destroy();
    chart.current = null;
  };

  useEffect(() => {
    (async () => {
      loading.value = true;
      apiData.value = dataUrl ? await getApiData(dataUrl) : null;
      loading.value = false;
    })();
  }, [dataUrl]);

  useLayoutEffect(() => {
    if (!container.current) return;
    if (!chart.current) {
      chart.current = new ChartJS(container.current, {
        type: spec.chartType,
        data: apiData.value ? spec.getData(apiData.value, chart.current) : {},
        options: spec.getOptions(updateChart),
      });
    } else {
      updateChart();
    }
  }, [apiData.value, container.current]);

  useLayoutEffect(() => {
    if (!showChart) destroyChart();
  }, [showChart]);

  useLayoutEffect(() => destroyChart, []);

  return (
    <>
      <h2 class="mt-1">
        {spec.getTitle()}

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
      {description && (
        <ExpandText>
          <p
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />
        </ExpandText>
      )}
      {showChart ? (
        <canvas class="mb-4" ref={container} style={{ height: "400px" }} />
      ) : (
        <div
          class={
            "card text-bg-light fs-4 text-dark d-flex " +
            "justify-content-center text-center mb-4"
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
