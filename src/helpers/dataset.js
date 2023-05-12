import { toObject } from "./utils";
import { rasterStyle, vectorStyle } from "./mapstyle";
import { legends } from "./legend";

const pad = (valueStr, offset = 0, digits = 2) =>
  (parseInt(valueStr, 10) + offset).toString().padStart(digits, "0");

const fileFormats = {
  csv: {
    title: "CSV",
  },
  geoJson: {
    title: "GeoJSON",
  },
  geoTiff: {
    title: "GeoTIFF",
  },
};

export const datasets = [
  {
    title: "Land Change",
    id: "land-change",
    fileFormats: [fileFormats.geoTiff],
    featured: true,
    getStyle: rasterStyle({
      getServiceName: ({ group, scenario, timeValue }) => {
        if (timeValue == 0) return;
        return `MP2023_S${pad(scenario)}_G${group}_C000_U00_V00_SLA_O_02_${pad(
          timeValue,
          2
        )}_W_${group == "520" ? "lndchg" : "lndtypdiff"}`;
      },
      order: 4000,
    }),
  },
  {
    title: "Vegetation Type (FFIBS)",
    id: "ffibs",
    fileFormats: [fileFormats.geoTiff],
    featured: true,
    getStyle: rasterStyle({
      getServiceName: ({ group, scenario, timeValue }) => {
        return `MP2023_S${pad(scenario)}_G${group}_C000_U00_V00_SLA_N_${pad(
          timeValue,
          2
        )}_${pad(timeValue, 2)}_W_FFIBS`;
      },
      order: 4000,
    }),
  },
  {
    title: "Vegetation Type (VCT)",
    id: "vct",
    fileFormats: [fileFormats.geoTiff],
    featured: true,
    getStyle: rasterStyle({
      getServiceName: ({ group, scenario, timeValue }) => {
        return `MP2023_S${pad(scenario)}_G${group}_C000_U00_V00_SLA_N_${pad(
          timeValue,
          2
        )}_${pad(timeValue, 2)}_V_VCT`;
      },
      order: 4000,
    }),
  },
  {
    title: "Flood Depth",
    id: "flood-depth",
    fileFormats: [fileFormats.geoTiff],
    featured: true,
    getStyle: rasterStyle({
      getServiceName: ({ aep, group, scenario, timeValue }) => {
        const timeStr = pad(timeValue == 0 ? timeValue + 1 : timeValue);
        return `MP2023_S${pad(
          scenario
        )}_G${group}_C000_U00_V00_SLA_O_${timeStr}_${timeStr}_CLARA_${aep.toFixed(
          1
        )}_aep_depths50_ft`;
      },
    }),
  },
  {
    title: "Estimated Annual Damages, Dollars",
    id: "estimated-annual-damages-dollars",
    fileFormats: [fileFormats.csv, fileFormats.geoJson],
    featured: true,
    route: "eadd",
    getStyle: vectorStyle({
      legend: legends.eadd,
      lineColors: ["#999999", "#444444"],
    }),
  },
  {
    title: "Estimated Annual Structural Damage",
    id: "estimated-annual-structural-damage",
    fileFormats: [fileFormats.csv, fileFormats.geoJson],
    featured: true,
    route: "easd",
    getStyle: vectorStyle({ legend: legends.easd }),
  },
  {
    title: "Land Area",
    id: "land-area",
    fileFormats: [fileFormats.csv, fileFormats.geoJson],
    featured: true,
    route: "land_area",
    getStyle: vectorStyle({ legend: legends.eadd }),
  },
];

export const datasetsMap = toObject(datasets);
