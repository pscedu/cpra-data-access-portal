import { BaseChart } from "./base";
import { formatNumber } from "../utils";

export class LineChart extends BaseChart {
  canZoom = true;
  chartType = "line";

  filterData(data, chart) {
    if (data.length < 1000) return data;
    const { min, max } = chart ? chart.scales.x : { min: 0, max: 1 };
    const filtered =
      min == 0 && max == 1
        ? data
        : data.filter(({ x }) => x >= min && x <= max);
    const step = Math.max(Math.ceil(filtered.length / 1000), 1);
    return data.filter((_, i) => i % step == 0);
  }

  getData(apiData, chart) {
    return {
      datasets: this.getDatasets(apiData).map((dataset) => ({
        ...dataset,
        data: this.filterData(dataset.data, chart),
      })),
    };
  }

  getOptions(updateChart) {
    const xLabel = this.getXLabel();
    const yLabel = this.getYLabel();
    return {
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
            text: xLabel,
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
              `${dataset.label}: ${formatNumber(raw.y)}`,
            title: (items) => `${xLabel} ${items[0].label}`,
          },
        },
        zoom: {
          pan: {
            enabled: true,
            mode: "x",
            modifierKey: "ctrl",
            onPanComplete: () => updateChart({ animation: "none" }),
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
            onZoomComplete: () => updateChart({ animation: "none" }),
          },
        },
      },
    };
  }
}
