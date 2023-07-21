import { toObject } from "./utils";
import { rasterStyle, vectorStyle } from "./mapstyle";
import { legends } from "./legend";
import { getTimeseriesURL } from "./timeseries";

const imageBaseUrl = "https://vm007.bridges2.psc.edu/files/raster";
const staticBaseUrl = "https://vm007.bridges2.psc.edu/files/static";

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
    description:
      "This is a raster that shows how the landscape composition has changed from initial conditions. If the land change is under a Future Without Action (FWOA), the raster values will be two digits. The first digit represents the landscape under initial conditions, and the second digit represents the landscape at the current year. For example, if the FWOA land change at year 10 has a value of 12, this indicates that the pixel started as land (1) in initial conditions and was converted to water (2) by year 10. If the land change is under a Future With Master Plan (FWMP), the raster values will be three digits. The first two digits will be identical to the FWOA land change, and the third digit will represent the landscape under FWMP. For example, if the FWMP land change at year 10 has a value of 121, this indicates that the pixel started as land (1) in initial conditions and was converted to water (2) by year 10 under FWOA; however, with the implementation of the Master Plan, this pixel was kept as land at year 10 under FWMP. The values of each digit representing landscape composition are defined as follows: 1=vegetated wetland; 2=open water; 3=unvegetated wetland/bare ground; 4=developed/upland; 5=flotant marsh.",
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
    legend: legends.ffibs,
    description:
      'The vegetation data can be viewed in one of two different ways; the first is to use the marsh classification, which uses a weighted score to classify the vegetation as Fresh Forested, Fresh Marsh, Intermediate Marsh, Brackish Marsh, or Saline Marsh, or FFIBS. For more information on the weighted FFIBS score methodology, see <a href="https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#C">Attachment C8</a>. FFIBS scores range from 0 to 24 for areas that are vegetated wetland. All other (non-vegetated wetland) areas use the following classifications: 200=open water; 300=unvegetated wetland/bare ground; 400=developed/upland; 500=flotant marsh. The second method is to summarize the mixture of vegetation species present into one of 15 vegetation community types, or VCT. For more information on which species are commonly associated with each VCT, see: Snedden, G.A., 2019. Patterning emergent marsh vegetation assemblages in coastal Louisiana, USA, with unsupervised artificial neural networks. Applied Vegetation Science. 22: 213-229. DOI: 10.1111.avsc.12425.',
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
    legend: legends.vct,
    description:
      'The vegetation data can be viewed in one of two different ways; the first is to use the marsh classification, which uses a weighted score to classify the vegetation as Fresh Forested, Fresh Marsh, Intermediate Marsh, Brackish Marsh, or Saline Marsh, or FFIBS. For m ore information on the weighted FFIBS score methodology, see <a href="https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/#C">Attachment C8</a>. The second method is to summarize the mixture of vegetation species present into one of 15 vegetation community types, or VCT. For more information on which species are commonly associated with each VCT, see: Snedden, G.A., 2019. Patterning emergent marsh vegetation assemblages in coastal Louisiana, USA, with unsupervised artificial neural networks. Applied Vegetation Science. 22: 213-229. DOI: 10.1111.avsc.12425.',
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
    description:
      'This dataset is the flood depth estimates (in feet), reported out at individual annual exceedance probabilities. To estimate flooding potential, our analysis considers storms of different intensity and tracks, and their expected probability of occurring in any one year. The flood depths resulting from those storms change over time as the coast degrades and sea level rise increases water levels. This dataset reports out the flood depth with a given likelihood of occurring in any given year, with a defined "annual exceedance probability". This is a statistically-derived dataset and is not representative of any actual single storm event. Rather this represents the flood depth with a given likelihood of exceedance for all points across the entire model domain.',
  },
  {
    title: "Estimated Annual Damages, Dollars",
    id: "estimated-annual-damages-dollars",
    fileFormats: [fileFormats.csv],
    featured: true,
    route: "eadd",
    unit: "$",
    getStyle: vectorStyle({
      lineColors: ["#999999", "#444444"],
    }),
    legend: legends.eadd,
    valueProp: "value_median",
    description:
      'This dataset is the flood damage estimates (in dollars), reported out at individual annual exceedance probabilities. To estimate flooding potential, our analysis considers storms of different intensity and tracks, and their expected probability of occurring in any one year. The flood depths resulting from those storms change over time as the coast degrades and sea level rise increases water levels. This dataset reports out the damage with a given likelihood of occurring in any given year, with a defined "annual exceedance probability". Like EADD/EASD, this is a statistically-derived dataset and is not representative of any actual single storm event. Rather this represents the flood damages with a given likelihood of exceedance for all points across the entire model domain. This damage is reported both in dollars and in the number of structures damaged.',
  },
  {
    title: "Estimated Annual Structural Damage",
    id: "estimated-annual-structural-damage",
    fileFormats: [fileFormats.csv],
    featured: true,
    route: "easd",
    unit: "structures",
    getStyle: vectorStyle(),
    legend: legends.easd,
    valueProp: "value_median",
    description:
      'This dataset is the flood damage estimates (in dollars), reported as a statistically-derived expected annual value. To estimate flooding potential, our analysis considers storms of different intensity and tracks, and their expected probability of occurring in any one year. The flood depths resulting from those storms change over time as the coast degrades and sea level rise increases water levels. Rather than selecting a single probability of flooding or a single time period, this dataset combines the total damage from all possible flood events considered and the likelihood of each event occurring, or "expected annual damages". This damage is reported both in dollars (EADD) and in the number of structures damaged (EASD) and the degree of damage experienced.',
  },
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
  {
    title: "Temperature",
    id: "temperature",
    fileFormats: [fileFormats.csv],
    featured: true,
    route: "temperature_mean",
    unit: "°C", // FIXME
    getStyle: vectorStyle(),
    legend: legends.temperature,
  },
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
    id: "initial-conditions-land-water",
    fileFormats: [fileFormats.geoTiffStatic],
    static: true,
    urls: [
      `${staticBaseUrl}/MP2023_S00_G000_C000_U00_V00_SLA_I_00_00_W_lndtyp.tif.zip`,
    ],
    description:
      "Landscape composition developed from satellite imagery collected in 2018, this represents the initial conditions used for the 2023 master plan development process.",
  },
  {
    title: "Initial Conditions: Vegetation Cover LULC",
    id: "initial-conditions-vegetation-cover-lulc",
    fileFormats: [fileFormats.geoTiffStatic],
    static: true,
    urls: [
      `${staticBaseUrl}/MP2023_Vegetetation_Baseline_2018_Final_Compilation.tif.zip`,
    ],
    description:
      "Landscape composition developed from satellite imagery collected in 2018, this represents the vegetation coverage of the initial conditions used for the 2023 master plan development process.",
  },
  {
    title: "Initial Conditions: FFIBS",
    id: "initial-conditions-ffibs",
    fileFormats: [fileFormats.geoTiffStatic],
    static: true,
    urls: [
      `${staticBaseUrl}/MP2023_S00_G000_C000_U00_V00_SLA_I_00_00_V_FFIBS.tif.zip`,
    ],
    description:
      "Landscape composition developed from satellite imagery collected in 2018, this represents the vegetation coverage of the initial conditions used for the 2023 master plan development process, that is then reclassified into a weighted FFIBS score for each of the ICM-LAVegMod 480-m grid cells.",
  },
  {
    title: "Marsh Edge Erosion",
    id: "marsh-edge-erosion",
    fileFormats: [fileFormats.geoTiffStatic],
    static: true,
    urls: [
      `${staticBaseUrl}/MP2023_S00_G000_C000_U00_V00_SLA_I_00_00_W_meer30.tif.zip`,
    ],
    description:
      "This is a raster of historic marsh edge erosion rates (in m/yr) that were quantified from high resolution aerial imagery for all marsh edge areas with at least 300-m of omnidirectional fetch.",
  },
  {
    title: "Deep Subsidence",
    id: "deep-subsidence",
    fileFormats: [fileFormats.geoTiffStatic],
    static: true,
    urls: [
      `${staticBaseUrl}/MP2023_S00_G000_C000_U00_V00_SLA_I_00_00_W_dpsub.tif.zip`,
    ],
    description:
      "The deep subsidence rates (mm/yr; positive indicates downward movement) were developed for use as a boundary condition in the 2023 Coastal Master Plan.",
  },
  {
    title: "Shallow Subsidence",
    id: "shallow-subsidence",
    fileFormats: [fileFormats.csvStatic],
    static: true,
    urls: [`${staticBaseUrl}/ecoregion_shallow_subsidence_mm.csv`],
    description:
      "The shallow subsidence rates (mm/yr; positive indicates downward movement) were developed for use as a boundary condition in the 2023 Coastal Master Plan.",
  },
];

export const datasetsMap = toObject(datasets);
