import { getApiUrl } from "../api";
import { catalog } from "../catalog";
import { getDatasetColor, scenarioName, toRGBA } from "../utils";

export class BaseChart {
  timeUnitLabels = {
    daily: "Daily",
    decadal: "Decadal",
    annual: "Annual",
  };

  constructor({
    choices = [],
    dataset,
    datasetDescriptions = {},
    geographies = [],
    range = [],
    scenarios = [],
  }) {
    this.choices = choices;
    this.dataset = dataset;
    this.datasetDescriptions = datasetDescriptions;
    this.geographies = geographies;
    this.scenarios = scenarios;
    if (range.length == 2) {
      this.min = range[0];
      this.max = range[1];
    }
  }

  filterData(data, chart) {
    return data;
  }

  getDatasetData(apiRows) {
    return apiRows.map((row) => this.getRowData(row));
  }

  getDatasets(apiData) {
    const datasets = [];
    let seenSids;
    for (let g in this.geographies) {
      seenSids = [];
      for (let s in this.scenarios) {
        let scenario = this.scenarios[s];
        if (seenSids.includes(scenario.sid)) continue;
        seenSids.push(scenario.sid);
        let color = getDatasetColor(g, s * -80);
        datasets.push({
          label: `${this.geographies[g]}: ${scenarioName(scenario, true)}`,
          backgroundColor: toRGBA(color, 0.3),
          borderColor: color,
          borderWidth: 2,
          data: this.getDatasetData(apiData[s][g]),
          pointRadius: 0,
        });
      }
    }
    return datasets;
  }

  getDescription() {
    return null;
  }

  getLabels() {
    return this.choices[0].timeValue;
  }

  getRowData(row) {
    return {
      x: row.elapsed_year,
      y: row[this.dataset.valueProp || "value"],
    };
  }

  getTitle() {
    return `${this.timeUnitLabels[this.scenarios[0].timeUnit]} ${
      this.scenarios[0].aggregate
        ? catalog.format(this.scenarios[0].aggregate, "aggregate")
        : ""
    } ${this.dataset.title}`;
  }

  getUrl() {
    if (!this.geographies || !this.geographies.length) return;
    return getApiUrl({
      dataset: this.dataset,
      geographies: this.geographies,
      scenarios: this.scenarios,
    });
  }

  getXLabel() {
    return "Elapsed Year";
  }

  getYLabel() {
    return `${this.dataset.title} (${this.dataset.unit})`;
  }
}
