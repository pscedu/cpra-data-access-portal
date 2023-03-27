const toObject = (items, key = "id") => {
  const obj = {};
  for (let item of items) obj[item[key]] = item;
  return obj;
};

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
  },
  {
    title: "Vegetation Type",
    id: "vegetation-type",
    fileFormats: [fileFormats.geoTiff],
    featured: true,
  },
  {
    title: "Flood Depth",
    id: "flood-depth",
    fileFormats: [fileFormats.geoTiff],
    featured: true,
  },
  {
    title: "Estimated Annual Damages, Dollars",
    id: "estimated-annual-damages-dollars",
    fileFormats: [fileFormats.csv, fileFormats.geoJson],
    featured: true,
  },
  {
    title: "Estimated Annual Structural Damage",
    id: "estimated-annual-structural-damage",
    fileFormats: [fileFormats.csv, fileFormats.geoJson],
    featured: true,
  },
];

export const datasetsMap = toObject(datasets);
