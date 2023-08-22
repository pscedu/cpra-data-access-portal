import { h } from "preact";
import { useContext, useLayoutEffect, useRef } from "preact/hooks";
import {
  Chart,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { State } from "../helpers/state";
import { formatNumber } from "../helpers/utils";

// Register the Chart.js components used in the visualization.
Chart.register(
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  zoomPlugin
);

const timeUnitLabels = {
  daily: "Day",
  decadal: "Year",
  annual: "Year",
};

const LineChart = () => {
  const { chartDatasets, dataset, scenarios } = useContext(State);
  const container = useRef(null);
  const chart = useRef(null);

  const timeUnit = scenarios.value[0].timeUnit;

  const filterData = (data) => {
    if (data.length < 1000) return data;
    const { min, max } = chart.current.scales.x;
    const filtered =
      min == 0 && max == 1
        ? data
        : data.filter(({ x }) => x >= min && x <= max);
    const step = Math.max(Math.ceil(filtered.length / 1000), 1);
    return data.filter((_, i) => i % step == 0);
  };

  const updateChartDatasets = (animation) => {
    // Cache the old datasets. For datasets that are remaining in the chart,
    // the object reference needs to stay the same. Otherwise the animation
    // won't work correctly.
    const oldDatasets = {};
    for (let oldDataset of chart.current.data.datasets)
      oldDatasets[oldDataset.label] = oldDataset;
    chart.current.data.datasets.length = 0;

    for (let chartDataset of chartDatasets.value) {
      let newDataset = oldDatasets[chartDataset.label] || {};
      for (let key of Object.keys(chartDataset))
        newDataset[key] =
          key == "data" ? filterData(chartDataset[key]) : chartDataset[key];
      chart.current.data.datasets.push(newDataset);
    }

    chart.current.stop();
    chart.current.update(animation);
  };

  const handleZoomPan = () => updateChartDatasets("none");

  useLayoutEffect(() => {
    if (!chart.current) {
      chart.current = new Chart(container.current, {
        type: "line",
        data: {
          datasets: chartDatasets.value.map((dataset) => ({
            ...dataset,
            data: filterData(dataset.data),
          })),
        },
        options: {
          interaction: {
            mode: "nearest",
            axis: "x",
            intersect: false,
          },
          scales: {
            x: {
              type: "linear",
              title: {
                display: true,
                text: timeUnitLabels[timeUnit],
              },
            },
            y: {
              title: {
                display: true,
                text: `${dataset.value.title} (${dataset.value.unit})`,
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: ({ dataset, raw }) =>
                  `${dataset.label}: ${formatNumber(raw.y)}`,
                title: (items) =>
                  `${timeUnitLabels[timeUnit]} ${items[0].label}`,
              },
            },
            zoom: {
              pan: {
                enabled: true,
                mode: "x",
                modifierKey: "ctrl",
                onPanComplete: handleZoomPan,
              },
              zoom: {
                wheel: {
                  enabled: true,
                },
                drag: {
                  enabled: true,
                },
                pinch: {
                  enabled: true,
                },
                mode: "x",
                onZoomComplete: handleZoomPan,
              },
            },
          },
        },
      });
    } else {
      updateChartDatasets();
    }
  }, [chartDatasets.value, dataset.value, timeUnit]);

  return <canvas ref={container} style={{ height: "400px" }} />;
};

export default LineChart;
