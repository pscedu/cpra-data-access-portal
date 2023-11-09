import { getApiUrl } from "../api";
import { BoxChart } from "./box";
import { catalog } from "../catalog";
import { datasetsMap } from "../dataset";

export class AepBoxChart extends BoxChart {
  constructor(options) {
    super(options);
    this.choices = [
      catalog.select({
        ...this.scenarios[0],
        dataset: "annual-exceedance-damages-dollars",
      }).choices,
    ];
    this.dataset = datasetsMap["annual-exceedance-damages-dollars"];
  }

  getDatasetData(apiRows) {
    const aepRows = {};
    for (let row of apiRows) aepRows[row.aep] = row;
    return this.choices[0].aep.map((aep) => this.getRowData(aepRows[aep]));
  }

  getDescription() {
    return this.datasetDescriptions["annual-exceedance-damages-dollars"];
  }

  getLabels() {
    return this.choices[0].aep.map((aep) => catalog.format(aep, "aep"));
  }

  getTitle() {
    return `${this.dataset.title}: Elapsed Year ${this.scenarios[0].timeValue}`;
  }

  getUrl() {
    if (!this.geographies || !this.geographies.length) return;
    return getApiUrl({
      dataset: this.dataset,
      geographies: this.geographies,
      scenarios: this.scenarios,
      wildcardProp: "aep",
    });
  }

  getXLabel() {
    return "Annual Exceedance Probability";
  }
}
