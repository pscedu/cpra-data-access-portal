import { toObject } from "./utils";
import { rasterStyle, vectorStyle } from "./mapstyle";
import { legends } from "./legend";
import { getApiUrl } from "./api";
import { downloadCsv } from "./csv";
import { catalog } from "./catalog";

const imageBaseUrl = "https://files.mpdap.coastal.la.gov/raster";
const staticBaseUrl = "https://files.mpdap.coastal.la.gov/static";

const pad = (valueStr, digits = 2) =>
  parseInt(valueStr, 10).toString().padStart(digits, "0");

function getStaticUrls(dataset) {
  return [dataset.urls[dataset.fileFormats.indexOf(this)]];
}

export const fileFormats = {
  csv: {
    id: "csv",
    abbreviation: "CSV",
    title: "Time Series CSV",
    icon: "filetype-csv",
    getUrls: (dataset, scenarios, geographies) =>
      geographies.length
        ? [
            getApiUrl({
              dataset,
              format: "csv",
              geographies,
              scenarios,
            }),
          ]
        : [],
  },
  csvAep: {
    id: "csv-aep",
    abbreviation: "CSV",
    title: "Time Series CSV (by AEP)",
    icon: "filetype-csv",
    getUrls: (dataset, scenarios, geographies) =>
      geographies.length
        ? [
            getApiUrl({
              dataset: datasetsMap["annual-exceedance-damages-dollars"],
              format: "csv",
              geographies,
              scenarios,
            }),
          ]
        : [],
  },
  csvMap: {
    id: "csv-map",
    abbreviation: "CSV",
    title: "Map CSV",
    icon: "filetype-csv",
    getUrls: (dataset, scenarios) => [
      getApiUrl({ dataset, format: "csv", scenarios }),
    ],
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
  xlsx: {
    id: "xlsx",
    abbreviation: "XLSX",
    title: "Microsoft Excel",
    icon: "filetype-xlsx",
    getUrls: getStaticUrls,
  },
};

export const datasets = [
  {
    title: "Home",
    id: "",
    fileFormats: [],
    featured: false,
    getName: () => {},
    getStyle: rasterStyle(),
    legend: legends.default,
  },
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
    unit: "ft",
    getName: ({ aep, group, scenario, timeValue }) => {
      const timeStr = pad(timeValue);
      return `MP2023_${scenario}_${group}_U00_${timeStr}_${timeStr}_CLARA_${Number(
        aep
      ).toFixed(1)}_aep_depths50_ft`;
    },
    getStyle: rasterStyle(),
    legend: legends.floodDepth,
  },
  {
    title: "Expected Annual Damages, Dollars",
    id: "expected-annual-damages-dollars",
    fileFormats: [fileFormats.csvMap, fileFormats.csv, fileFormats.csvAep],
    featured: true,
    route: "eadd",
    unit: "$",
    getStyle: vectorStyle({
      lineColors: ["#999999", "#444444"],
    }),
    legend: legends.eadd,
    valueProp: "value_50",
    charts: ["box", "aep-box"],
  },
  {
    title: "Expected Annual Structural Damage",
    id: "expected-annual-structural-damage",
    fileFormats: [fileFormats.csvMap, fileFormats.csv],
    featured: true,
    route: "easd",
    unit: "structures",
    getStyle: vectorStyle(),
    legend: legends.easd,
    valueProp: "value_50",
    charts: ["box"],
  },
  {
    title: "Annual Exceedance Damages, Dollars",
    id: "annual-exceedance-damages-dollars",
    fileFormats: [fileFormats.csvMap, fileFormats.csv],
    route: "damage",
    unit: "$",
    getStyle: vectorStyle({
      lineColors: ["#999999", "#444444"],
    }),
    legend: legends.eadd,
    valueProp: "value_50",
    charts: ["box"],
  },
  {
    title: "Nonstructural Expected Annual Damage, Dollars",
    id: "nonstructural-expected-annual-damage-dollars",
    fileFormats: [fileFormats.csvMap, fileFormats.csv],
    route: "nseadd",
    unit: "$",
    getStyle: vectorStyle(),
    legend: legends.eadd,
    valueProp: "value_50",
    charts: ["box"],
  },
  {
    title: "Nonstructural Expected Annual Structural Damage",
    id: "nonstructural-expected-annual-structural-damage",
    fileFormats: [fileFormats.csvMap, fileFormats.csv],
    route: "nseasd",
    unit: "structure equivalents",
    getStyle: vectorStyle(),
    legend: legends.easd,
    valueProp: "value_50",
    charts: ["box"],
  },
  {
    title: "Salinity",
    id: "salinity",
    fileFormats: [fileFormats.csvMap, fileFormats.csv],
    route: "salinity",
    unit: "ppt",
    getStyle: vectorStyle(),
    legend: legends.salinity,
    charts: ["line"],
  },
  {
    title: "Water Level",
    id: "water-level",
    fileFormats: [fileFormats.csvMap, fileFormats.csv],
    route: "water_level",
    unit: "NAVD88 m",
    getStyle: vectorStyle(),
    legend: legends.waterLevel,
    charts: ["line"],
  },
  {
    title: "Water Level Variability",
    id: "water-level-variability",
    fileFormats: [fileFormats.csvMap, fileFormats.csv],
    route: "tidal_range",
    unit: "m",
    getStyle: vectorStyle(),
    legend: legends.waterLevelVariability,
    charts: ["line"],
  },
  {
    title: "Total Suspended Solids",
    id: "total-suspended-solids",
    fileFormats: [fileFormats.csvMap, fileFormats.csv],
    route: "tss",
    unit: "mg/L",
    getStyle: vectorStyle(),
    legend: legends.totalSuspendedSolids,
    charts: ["line"],
  },
  {
    title: "Surge Water Surface Elevations by Exceedance",
    id: "surge-water-surface-elevations-by-exceedance",
    fileFormats: [fileFormats.csvMap, fileFormats.csv],
    route: "elevation_exceedance",
    unit: "NAVD88 ft",
    getStyle: vectorStyle(),
    legend: legends.surgeWaterSurfaceElevations,
    valueProp: "value_50",
    charts: ["box"],
  },
  {
    title: "Surge Water Surface Elevations by Storm",
    id: "surge-water-surface-elevations-by-storm",
    fileFormats: [fileFormats.csvMap, fileFormats.csv],
    route: "elevation_storm",
    unit: "NAVD88 ft",
    getStyle: vectorStyle(),
    legend: legends.surgeWaterSurfaceElevations,
    charts: ["line"],
  },
  {
    title: "Wave Heights by Exceedance",
    id: "wave-heights-by-exceedance",
    fileFormats: [fileFormats.csvMap, fileFormats.csv],
    route: "wave_height_exceedance",
    unit: "ft",
    getStyle: vectorStyle(),
    legend: legends.waveHeights,
    valueProp: "value_50",
    charts: ["box"],
  },
  {
    title: "Wave Heights by Storm",
    id: "wave-heights-by-storm",
    fileFormats: [fileFormats.csvMap, fileFormats.csv],
    route: "wave_height_storm",
    unit: "ft",
    getStyle: vectorStyle(),
    legend: legends.waveHeights,
    charts: ["line"],
  },
  {
    title: "Exposure: Asset Count",
    id: "exposure-asset-count",
    fileFormats: [fileFormats.csvMap, fileFormats.csv],
    route: "exposure_asset_count",
    unit: "structures",
    docId: "exposure",
    getStyle: vectorStyle(),
    legend: legends.exposureAssetCount,
    charts: ["line"],
  },
  {
    title: "Exposure: Critical Infrastructure Count",
    id: "exposure-critical-infrastructure-count",
    fileFormats: [fileFormats.csvMap, fileFormats.csv],
    route: "exposure_critical_infrastructure_count",
    unit: "structures",
    docId: "exposure",
    getStyle: vectorStyle(),
    legend: legends.exposureExposedStructures,
    charts: ["line"],
  },
  {
    title: "Exposure: Historic Properties Count",
    id: "exposure-historic-properties-count",
    fileFormats: [fileFormats.csvMap, fileFormats.csv],
    route: "exposure_historic_properties_count",
    unit: "structures",
    docId: "exposure",
    getStyle: vectorStyle(),
    legend: legends.exposureExposedStructures,
    charts: ["line"],
  },
  {
    title: "Temperature",
    id: "temperature",
    fileFormats: [fileFormats.csvMap, fileFormats.csv],
    route: "temperature",
    unit: "°C",
    getStyle: vectorStyle(),
    legend: legends.temperature,
    charts: ["line"],
  },
  {
    title: "Vegetation Coverage Area",
    id: "vegetation-coverage-area",
    fileFormats: [fileFormats.csvMap, fileFormats.csv],
    route: "vegetation_coverage_area",
    unit: "square m",
    getStyle: vectorStyle(),
    legend: legends.vegetationCoverageArea,
    charts: ["line"],
  },
  // {
  //   title: "Habitat Suitability Unit",
  //   id: "habitat-suitability-unit",
  //   fileFormats: [fileFormats.csvMap, fileFormats.csv],
  //   route: "habitat_suitability_unit",
  //   getStyle: vectorStyle(),
  //   legend: legends.habitatSuitabilityUnit,
  // },
  {
    title: "Population",
    id: "population",
    fileFormats: [fileFormats.csvMap, fileFormats.csv],
    route: "population",
    unit: "persons",
    getStyle: vectorStyle(),
    legend: legends.population,
    charts: ["line"],
  },
  {
    title: "Population Change",
    id: "population-change",
    fileFormats: [fileFormats.csvMap, fileFormats.csv],
    route: "population_change",
    unit: "persons",
    getStyle: vectorStyle(),
    legend: legends.populationChange,
    valueProp: "value_50",
    charts: ["box"],
  },
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
    title: "MP-DAP Scenarios",
    id: "scenarios",
    fileFormats: [fileFormats.csvStatic],
    static: true,
    urls: [() => downloadCsv(catalog.listScenarios(), "mpdap-scenarios.csv")],
    description:
      "This file includes the scenario identifiers and values for all scenarios available in the MP-DAP.",
  },
  {
    title: "2023 Master Plan Projects",
    id: "2023-master-plan-projects",
    fileFormats: [fileFormats.fileGdb],
    static: true,
    urls: [`${staticBaseUrl}/2023_Master_Plan_Projects.zip`],
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
  {
    title: "NOAA Tidal Station Data Analysis",
    id: "noaa-tidal-station-data-analysis",
    fileFormats: [fileFormats.xlsx],
    static: true,
    urls: [`${staticBaseUrl}/MP2023_NOAA_tidal_station_data_analysis.zip`],
  },
  {
    title: "Attachment B2: Supplemental Materials",
    id: "attachment-b2-supplemental-materials",
    fileFormats: [fileFormats.xlsx],
    static: true,
    urls: [`${staticBaseUrl}/MP2023_AppendixB2_Supplemental_Materials.zip`],
  },
];

export const datasetsMap = toObject(datasets);
