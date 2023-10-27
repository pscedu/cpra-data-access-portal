import { getApiUrl } from "./api";
import { catalog } from "./catalog";
import { getDatasetColor, scenarioName, toRGBA } from "./utils";

const timeUnitLabels = {
  daily: "Daily",
  decadal: "Decadal",
  annual: "Annual",
};

const getChartDatasets = (dataset, scenarios, geographies, spec, apiData) => {
  const datasets = [];
  let seenSids;
  for (let g in geographies) {
    seenSids = [];
    for (let s in scenarios) {
      let scenario = scenarios[s];
      if (seenSids.includes(scenario.sid)) continue;
      seenSids.push(scenario.sid);
      let color = getDatasetColor(g, s * -80);
      datasets.push({
        label: `${geographies[g]}: ${scenarioName(scenario, true)}`,
        backgroundColor: toRGBA(color, 0.3),
        borderColor: color,
        borderWidth: 2,
        data: apiData[s][g].map((row) => spec.getRowData(row, dataset)),
        pointRadius: 0,
      });
    }
  }
  return datasets;
};
const getDataUrl = (dataset, scenarios, geographies) => {
  if (!geographies || !geographies.length) return;
  return getApiUrl({ dataset, geographies, scenarios });
};
const getLabels = (dataset, choices) => choices[0].timeValue;
const getTitle = (dataset, scenarios, geographies) =>
  `${timeUnitLabels[scenarios[0].timeUnit]} ${
    scenarios[0].aggregate
      ? catalog.format(scenarios[0].aggregate, "aggregate")
      : ""
  } ${dataset.title}`;
{
}
const getXLabel = () => "Elapsed Year";
const getYLabel = (dataset) => `${dataset.title} (${dataset.unit})`;
const getBoxRowData = (row) => ({
  min: row.value_10 || row.value_05,
  q1: row.value_50,
  median: row.value_50,
  q3: row.value_50,
  max: row.value_90 || row.value_95,
  whiskerMin: row.value_10 || row.value_05,
  whiskerMax: row.value_90 || row.value_95,
  minLabel: "value_10" in row ? "10%" : "5%",
  maxLabel: "value_90" in row ? "90%" : "95%",
});

export const chartTypes = {
  box: {
    id: "box",
    component: "BoxChart",
    getChartDatasets,
    getDataUrl,
    getLabels,
    getRowData: getBoxRowData,
    getTitle,
    getXLabel,
    getYLabel,
  },
  line: {
    id: "line",
    canZoom: true,
    component: "LineChart",
    getChartDatasets,
    getDataUrl,
    getRowData: (row, dataset) => ({
      x: row.elapsed_year,
      y: row[dataset.valueProp || "value"],
    }),
    getTitle,
    getXLabel,
    getYLabel,
    showZoomHelp: true,
  },
};
