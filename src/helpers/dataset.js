import { toObject } from "./utils";
import { rasterStyle, vectorStyle } from "./mapstyle";
import { legends } from "./legend";
import { getTimeseriesURL } from "./timeseries";

const imageBaseUrl = "https://files.mpdap.coastal.la.gov/raster";
const staticBaseUrl = "https://files.mpdap.coastal.la.gov/static";

const pad = (valueStr, digits = 2) =>
  parseInt(valueStr, 10).toString().padStart(digits, "0");

function getStaticUrls(dataset) {
  return [dataset.urls[dataset.fileFormats.indexOf(this)]];
}

export const chartTypes = {
  box: {
    id: "box",
    getRowData: (row) => ({
      min: row.value_min,
      q1: row.value_q1,
      median: row.value_median,
      q3: row.value_q3,
      max: row.value_max,
    }),
  },
  line: {
    id: "line",
    getRowData: (row, dataset) => ({
      x: row.elapsed_year,
      y: row[dataset.valueProp || "value"],
    }),
  },
};

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
  csvStatic: {
    id: "csv-static",
    abbreviation: "CSV",
    title: "CSV",
    icon: "filetype-csv",
    getUrls: getStaticUrls,
  },
  fileGdb: {
    id: "filegdb",
    abbreviation: "FileGDB",
    title: "File Geodatabase",
    getUrls: getStaticUrls,
  },
  geoJson: {
    id: "geojson",
    abbreviation: "GeoJSON",
    title: "GeoJSON",
    icon: "filetype-json",
    getUrls: getStaticUrls,
  },
  geoPackageAndTiff: {
    id: "gpkg-tiff",
    abbreviation: "GPKG + TIFF",
    title: "GeoPackage and GeoTIFF",
    getUrls: getStaticUrls,
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
  geoTiffStatic: {
    id: "geotiff-static",
    abbreviation: "GeoTIFF",
    title: "GeoTIFF",
    icon: "filetype-tiff",
    getUrls: getStaticUrls,
  },
  html: {
    id: "html",
    abbreviation: "HTML",
    title: "HTML",
    icon: "link",
    getUrls: getStaticUrls,
  },
  plainText: {
    id: "plain-text",
    abbreviation: "Text",
    title: "Text",
    icon: "filetype-txt",
    getUrls: getStaticUrls,
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
    legend: legends.landChange,
  },
  {
    title: "Vegetation Type: FFIBS",
    id: "vegetation-type-ffibs",
    fileFormats: [fileFormats.geoTiff],
    featured: true,
    getName: ({ group, scenario, timeValue }) => {
      const year = pad(timeValue);
      return `MP2023_${scenario}_${group}_U00_${year}_${year}_FFIBS`;
    },
    getStyle: rasterStyle({
      order: 4000,
    }),
    legend: legends.ffibs,
  },
  {
    title: "Vegetation Type: VCT",
    id: "vegetation-type-vct",
    fileFormats: [fileFormats.geoTiff],
    featured: true,
    getName: ({ group, scenario, timeValue }) => {
      const year = pad(timeValue);
      return `MP2023_${scenario}_${group}_U00_${year}_${year}_VCT`;
    },
    getStyle: rasterStyle({
      order: 4000,
    }),
    legend: legends.vct,
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
    getStyle: rasterStyle(),
    legend: legends.floodDepth,
  },
  {
    title: "Expected Annual Damages, Dollars",
    id: "expected-annual-damages-dollars",
    fileFormats: [fileFormats.csv],
    featured: true,
    route: "eadd",
    unit: "$",
    getStyle: vectorStyle({
      lineColors: ["#999999", "#444444"],
    }),
    legend: legends.eadd,
    valueProp: "value_median",
    chartType: chartTypes.box,
  },
  {
    title: "Expected Annual Structural Damage",
    id: "expected-annual-structural-damage",
    fileFormats: [fileFormats.csv],
    featured: true,
    route: "easd",
    unit: "structures",
    getStyle: vectorStyle(),
    legend: legends.easd,
    valueProp: "value_median",
    chartType: chartTypes.box,
  },
  {
    title: "Annual Exceedance Damages, Dollars",
    id: "annual-exceedance-damages-dollars",
    fileFormats: [fileFormats.csv],
    featured: true,
    route: "damage",
    unit: "$",
    getStyle: vectorStyle({
      lineColors: ["#999999", "#444444"],
    }),
    legend: legends.eadd,
    valueProp: "value_median",
    chartType: chartTypes.box,
  },
  {
    title: "Salinity",
    id: "salinity",
    fileFormats: [fileFormats.csv],
    featured: true,
    route: "salinity_mean",
    unit: "ppm",
    getStyle: vectorStyle(),
    legend: legends.salinity,
  },
  {
    title: "Water Level",
    id: "water-level",
    fileFormats: [fileFormats.csv],
    featured: true,
    route: "water_level_mean",
    unit: "NAVD88 m",
    getStyle: vectorStyle(),
    legend: legends.waterLevel,
  },
  {
    title: "Total Suspended Solids",
    id: "total-suspended-solids",
    fileFormats: [fileFormats.csv],
    featured: true,
    route: "tss_mean",
    unit: "ppm", // FIXME
    getStyle: vectorStyle(),
    legend: legends.totalSuspendedSolids,
  },
  // {
  //   title: "Temperature",
  //   id: "temperature",
  //   fileFormats: [fileFormats.csv],
  //   featured: true,
  //   route: "temperature_mean",
  //   unit: "°C", // FIXME
  //   getStyle: vectorStyle(),
  //   legend: legends.temperature,
  // },
  // {
  //   title: "Land Area",
  //   id: "land-area",
  //   fileFormats: [fileFormats.csv],
  //   featured: true,
  //   route: "land_area",
  //   unit: "sq m",
  //   getStyle: vectorStyle(),
  //   legend: legends.default,
  // },
  {
    title: "Documentation",
    id: "documentation",
    fileFormats: [fileFormats.html, fileFormats.plainText],
    static: true,
    urls: ["/dataset/", `${staticBaseUrl}/documentation.md`],
    description:
      "This text file includes metadata descriptions for all datasets available for visualization and/or download in the Master Plan Data Access Portal.",
  },
  {
    title: "Model Geometries",
    id: "model-geometries",
    fileFormats: [fileFormats.geoPackageAndTiff, fileFormats.fileGdb],
    static: true,
    urls: [
      `${staticBaseUrl}/model-geometries.zip`,
      `${staticBaseUrl}/model-geometries.gdb.zip`,
    ],
    description:
      "This package file includes grid files that define the model domains for the 2023 Master Plan models.",
  },
  {
    title: "Initial Conditions: Land/Water",
    id: "initial-conditions-landwater",
    fileFormats: [fileFormats.geoTiffStatic],
    static: true,
    urls: [
      `${staticBaseUrl}/MP2023_S00_G000_C000_U00_V00_SLA_I_00_00_W_lndtyp.tif.zip`,
    ],
  },
  {
    title: "Initial Conditions: Vegetation Cover LULC",
    id: "initial-conditions-vegetation-cover-lulc",
    fileFormats: [fileFormats.geoTiffStatic],
    static: true,
    urls: [
      `${staticBaseUrl}/MP2023_Vegetetation_Baseline_2018_Final_Compilation.tif.zip`,
    ],
  },
  {
    title: "Initial Conditions: FFIBS",
    id: "initial-conditions-ffibs",
    fileFormats: [fileFormats.geoTiffStatic],
    static: true,
    urls: [
      `${staticBaseUrl}/MP2023_S00_G000_C000_U00_V00_SLA_I_00_00_V_FFIBS.tif.zip`,
    ],
  },
  {
    title: "Marsh Edge Erosion",
    id: "marsh-edge-erosion",
    fileFormats: [fileFormats.geoTiffStatic],
    static: true,
    urls: [
      `${staticBaseUrl}/MP2023_S00_G000_C000_U00_V00_SLA_I_00_00_W_meer30.tif.zip`,
    ],
  },
  {
    title: "Deep Subsidence",
    id: "deep-subsidence",
    fileFormats: [fileFormats.geoTiffStatic],
    static: true,
    urls: [
      `${staticBaseUrl}/MP2023_S00_G000_C000_U00_V00_SLA_I_00_00_W_dpsub.tif.zip`,
    ],
  },
  {
    title: "Shallow Subsidence",
    id: "shallow-subsidence",
    fileFormats: [fileFormats.csvStatic],
    static: true,
    urls: [`${staticBaseUrl}/ecoregion_shallow_subsidence_mm.csv`],
  },
];

export const datasetsMap = toObject(datasets);
