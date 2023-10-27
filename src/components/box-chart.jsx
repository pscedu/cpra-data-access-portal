import { useLayoutEffect, useRef } from "preact/hooks";
import {
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import {
  BoxAndWiskers,
  BoxPlotController,
} from "@sgratzl/chartjs-chart-boxplot";
import { formatNumber } from "../helpers/utils";

// Register the Chart.js components used in the visualization.
Chart.register(
  BoxAndWiskers,
  BoxPlotController,
  CategoryScale,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip
);

const BoxChart = ({ chartDatasets, labels, xLabel, yLabel }) => {
  const container = useRef(null);
  const chart = useRef(null);

  useLayoutEffect(() => {
    if (!chart.current) {
      chart.current = new Chart(container.current, {
        type: "boxplot",
        data: {
          labels,
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
              title: {
                display: true,
                text: xLabel || "Elapsed Year",
              },
            },
            y: {
              title: {
                display: true,
                text: yLabel,
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: ({ dataset, raw }) =>
                  `${dataset.label}: (${raw.minLabel}: ${formatNumber(
                    raw.min
                  )}, 50%: ${formatNumber(raw.median)}, ${
                    raw.maxLabel
                  }: ${formatNumber(raw.max)})`,
                title: (items) => `${xLabel} ${items[0].label}`,
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
  }, [container.current, chartDatasets.value, labels, xLabel, yLabel]);

  useLayoutEffect(
    () => () => {
      if (chart.current) chart.current.destroy();
    },
    []
  );

  return <canvas ref={container} style={{ height: "400px" }} />;
};

export default BoxChart;
