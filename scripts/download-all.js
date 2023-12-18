/**
 * Download all DAP data from the MPD.
 * Usage: node --loader ./scripts/esm-loader.js ./scripts/download-all.js /dest/dir
 */

import https from "https";
import path from "path";
import stream from "stream/promises";
import { createWriteStream } from "fs";
import { baseUrl } from "../src/helpers/api";
import { catalog } from "../src/helpers/catalog";
import { datasets, fileFormats } from "../src/helpers/dataset";

const { csvAll } = fileFormats;

function asyncGet(url) {
  return new Promise((resolve) => {
    https.get(url, resolve);
  });
}

async function downloadDatasets(destDir) {
  for (let dataset of datasets) {
    if (!dataset.fileFormats.includes(csvAll)) continue;
    let options = { dataset: dataset.id };
    for (let geoUnit of catalog.select(options).choices.geographicUnit) {
      options.geographicUnit = geoUnit;
      for (let aggregate of catalog.select(options).choices.aggregate || [""]) {
        options.aggregate = aggregate;
        for (let timeUnit of catalog.select(options).choices.timeUnit) {
          options.timeUnit = timeUnit;
          let filename = csvAll.getUrls(dataset, [options])[0].split("/").pop();
          let route = dataset.route;
          if (aggregate) route += `_${aggregate}`;
          let url = `${baseUrl}/${geoUnit}/${timeUnit}/${route}/?format=csv`;
          if (timeUnit == "daily") continue;
          let writeStream = createWriteStream(path.join(destDir, filename));
          let readStream = await asyncGet(url);
          console.log(`Downloading ${url}...`);
          await stream.pipeline(readStream, writeStream);
        }
      }
    }
  }
}

downloadDatasets(process.argv[2]);
