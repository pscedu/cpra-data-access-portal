import { toObject } from "./utils";
import { rasterStyle, vectorStyle } from "./mapstyle";
import { legends } from "./legend";
import { getTimeseriesURL } from "./timeseries";

const imageBaseUrl = "/files/raster";

const pad = (valueStr, digits = 2) =>
  parseInt(valueStr, 10).toString().padStart(digits, "0");

export const fileFormats = {
  csv: {
    id: "csv",
    abbreviation: "CSV",
    title: "Time Series CSV",
    icon: "filetype-csv",
    getUrls: (dataset, scenarios, geographies) =>
      geographies.length
        ? [getTimeseriesURL(dataset.route, scenarios, geographies, "csv")]
        : [],
  },
  geoJson: {
    id: "geojson",
    abbreviation: "GeoJSON",
    title: "GeoJSON",
    icon: "filetype-json",
  },
  geoTiff: {
    id: "geotiff",
    abbreviation: "GeoTIFF",
    title: "GeoTIFF",
    icon: "filetype-tiff",
    getUrls: (dataset, scenarios) =>
      scenarios
        .map((scenario) => dataset.getName(scenario))
        .filter((name) => name !== undefined)
        .map((name) => `${imageBaseUrl}/${name}.tif`),
  },
};

export const datasets = [
  {
    title: "Land Change",
    id: "land-change",
    fileFormats: [fileFormats.geoTiff],
    featured: true,
    getName: ({ group, scenario, timeValue }) => {
      if (timeValue == 2) return;
      const endYear = pad(timeValue);
      const imageType = group == "FWOA" ? "lndchg" : "lndtypdiff";
      return `MP2023_${scenario}_${group}_U00_02_${endYear}_${imageType}`;
    },
    getStyle: rasterStyle({
      order: 4000,
    }),
  },
  {
    title: "Vegetation Type (FFIBS)",
    id: "ffibs",
    fileFormats: [fileFormats.geoTiff],
    featured: true,
    getName: ({ group, scenario, timeValue }) => {
      const year = pad(timeValue);
      return `MP2023_${scenario}_${group}_U00_${year}_${year}_FFIBS`;
    },
    getStyle: rasterStyle({
      order: 4000,
    }),
  },
  {
    title: "Vegetation Type (VCT)",
    id: "vct",
    fileFormats: [fileFormats.geoTiff],
    featured: true,
    getName: ({ group, scenario, timeValue }) => {
      const year = pad(timeValue);
      return `MP2023_${scenario}_${group}_U00_${year}_${year}_VCT`;
    },
    getStyle: rasterStyle({
      order: 4000,
    }),
  },
  {
    title: "Flood Depth",
    id: "flood-depth",
    fileFormats: [fileFormats.geoTiff],
    featured: true,
    getName: ({ aep, group, scenario, timeValue }) => {
      const timeStr = pad(timeValue);
      return `MP2023_${scenario}_${group}_U00_${timeStr}_${timeStr}_CLARA_${aep.toFixed(
        1
      )}_aep_depths50_ft`;
    },
    getStyle: rasterStyle({}),
  },
  // {
  //   title: "Estimated Annual Damages, Dollars",
  //   id: "estimated-annual-damages-dollars",
  //   fileFormats: [fileFormats.csv, fileFormats.geoJson],
  //   featured: true,
  //   route: "eadd",
  //   unit: "$",
  //   getStyle: vectorStyle({
  //     legend: legends.eadd,
  //     lineColors: ["#999999", "#444444"],
  //   }),
  // },
  // {
  //   title: "Estimated Annual Structural Damage",
  //   id: "estimated-annual-structural-damage",
  //   fileFormats: [fileFormats.csv, fileFormats.geoJson],
  //   featured: true,
  //   route: "easd",
  //   unit: "structures",
  //   getStyle: vectorStyle({ legend: legends.easd }),
  // },
  // {
  //   title: "Annual Exceedance Damages, Dollars",
  //   id: "annual-exceedance-damages-dollars",
  //   fileFormats: [fileFormats.csv],
  //   featured: true,
  //   route: "damage",
  //   unit: "$",
  //   getStyle: vectorStyle({ legend: legends.default }),
  // },
  {
    title: "Salinity",
    id: "salinity",
    fileFormats: [fileFormats.csv],
    featured: true,
    route: "salinity_mean",
    unit: "ppm",
    getStyle: vectorStyle({ legend: legends.default }),
  },
  {
    title: "Water Level",
    id: "water-level",
    fileFormats: [fileFormats.csv],
    featured: true,
    route: "water_level_mean",
    unit: "NAVD88 m",
    getStyle: vectorStyle({ legend: legends.default }),
  },
  {
    title: "Total Suspended Solids",
    id: "total-suspended-solids",
    fileFormats: [fileFormats.csv],
    featured: true,
    route: "tss_mean",
    unit: "ppm", // FIXME
    getStyle: vectorStyle({ legend: legends.default }),
  },
  {
    title: "Temperature",
    id: "temperature",
    fileFormats: [fileFormats.csv],
    featured: true,
    route: "temperature_mean",
    unit: "degrees C", // FIXME
    getStyle: vectorStyle({ legend: legends.default }),
  },
  {
    title: "Land Area",
    id: "land-area",
    fileFormats: [fileFormats.csv],
    featured: true,
    route: "land_area",
    unit: "sq m",
    getStyle: vectorStyle({ legend: legends.default }),
  },
];

export const datasetsMap = toObject(datasets);
