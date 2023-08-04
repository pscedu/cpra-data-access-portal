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
import { State } from "../helpers/state";

// Register the Chart.js components used in the visualization.
Chart.register(
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip
);

const timeUnitLabels = {
  daily: "Day",
  decadal: "Decade",
  annual: "Year",
};

const LineChart = () => {
  const { chartDatasets, dataset, scenarios } = useContext(State);
  const container = useRef(null);
  const chart = useRef(null);

  const timeUnit = scenarios.value[0].timeUnit;

  useLayoutEffect(() => {
    if (!chart.current) {
      chart.current = new Chart(container.current, {
        type: "line",
        data: {
          datasets: chartDatasets.value,
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
                title: (items) =>
                  `${timeUnitLabels[timeUnit]} ${items[0].label}`,
              },
            },
          },
        },
      });
    } else {
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
          newDataset[key] = chartDataset[key];
        chart.current.data.datasets.push(newDataset);
      }

      chart.current.update();
    }
  }, [chartDatasets.value, dataset.value, timeUnit]);

  return <canvas ref={container} style={{ height: "400px" }} />;
};

export default LineChart;
