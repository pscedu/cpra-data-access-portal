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
import { useSignalEffect } from "@preact/signals";
import { getTimeseriesData } from "../helpers/timeseries";
import { scenarioName } from "../helpers/utils";

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
  day: "Day",
  decade: "Decade",
  year: "Year",
};

const LineChart = () => {
  const { dataset, geographies, scenarios } = useContext(State);
  const container = useRef(null);
  const chart = useRef(null);

  useLayoutEffect(() => {
    chart.current = new Chart(container.current, {
      type: "line",
      data: {
        datasets: [],
      },
      options: {
        scales: {
          x: {
            type: "linear",
            title: {
              display: true,
              text: timeUnitLabels[scenarios.value[0].timeUnit],
            },
          },
          y: {
            title: {
              display: true,
              text: `${dataset.value.title} (${dataset.value.unit})`,
            },
          },
        },
      },
    });
    return () => chart.current.destroy();
  }, []);

  useSignalEffect(async () => {
    const apiData = await getTimeseriesData(
      dataset.value.route,
      scenarios.value,
      geographies.value
    );
    const datasets = [];
    for (let g in geographies.value)
      for (let s in scenarios.value)
        datasets.push({
          label: `${geographies.value[g]} (${scenarioName(s)})`,
          borderColor: "red",
          borderWidth: 2,
          data: apiData[s][g].map((row) => ({ x: row.time, y: row.value })),
        });
    if (chart.current) {
      chart.current.data.datasets = datasets;
      chart.current.update();
    }
  });

  return <canvas ref={container} style={{ height: "400px" }} />;
};

export default LineChart;
