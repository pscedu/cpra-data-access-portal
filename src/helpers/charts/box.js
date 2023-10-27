import { BaseChart } from "./base";
import { formatNumber } from "../utils";

export class BoxChart extends BaseChart {
  chartType = "boxplot";

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
      datasets: this.getDatasets(apiData),
      labels: this.getLabels(),
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
    };
  }

  getRowData(row, chart) {
    return {
      min: row.value_10 || row.value_05,
      q1: row.value_50,
      median: row.value_50,
      q3: row.value_50,
      max: row.value_90 || row.value_95,
      whiskerMin: row.value_10 || row.value_05,
      whiskerMax: row.value_90 || row.value_95,
      minLabel: "value_10" in row ? "10%" : "5%",
      maxLabel: "value_90" in row ? "90%" : "95%",
    };
  }
}
