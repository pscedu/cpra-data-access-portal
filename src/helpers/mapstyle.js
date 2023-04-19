const baseUrl = "https://tiles.mpdv.coastal.la.gov/services";

const rasterSource = (service) => ({
  bounds: [
    -94.00080091962352, 28.70426878930118, -87.51148588666453,
    31.048795426051505,
  ],
  maxzoom: 13,
  type: "raster",
  tiles: ["a", "b", "c", "d"].map(
    (letter) =>
      `${baseUrl.replace(
        /\/\//g,
        `//${letter}.`
      )}/${service}/tiles/{z}/{x}/{y}.png`
  ),
  tileSize: 256,
});

export function getBaseStyle() {
  return {
    sources: {
      "basemap-raster": rasterSource("basemap-raster"),
      "basemap-vector": {
        type: "vector",
        url: `${baseUrl}/basemap-vector`,
      },
    },
    layers: [
      {
        id: "background",
        type: "background",
        paint: {
          "background-color": "#ffffff",
        },
        order: 0,
      },
      {
        id: "state",
        type: "fill",
        source: "basemap-vector",
        "source-layer": "state",
        paint: {
          "fill-color": "#d6d6d6",
        },
        order: 1,
      },
      {
        id: "state-screen",
        type: "fill",
        source: "basemap-vector",
        "source-layer": "state",
        filter: ["!=", ["get", "abbr"], "LA"],
        paint: {
          "fill-color": "#ffffff",
          "fill-opacity": 0.4,
        },
        order: 2,
      },
      {
        id: "water-not-in-icm",
        type: "fill",
        source: "basemap-vector",
        "source-layer": "water",
        paint: {
          "fill-color": "#ffffff",
        },
        order: 5000,
      },
      {
        id: "initial-conditions-water",
        type: "raster",
        source: "basemap-raster",
        order: 5001,
      },
      {
        id: "levee",
        type: "line",
        source: "basemap-vector",
        "source-layer": "levee",
        paint: {
          "line-color": "#939598",
          "line-opacity": 0.5,
          "line-width": 0.667,
        },
        order: 10000,
      },
      {
        id: "road-secondary",
        type: "line",
        source: "basemap-vector",
        "source-layer": "road",
        filter: ["==", ["get", "type"], "S"],
        paint: {
          "line-color": "#a4a4a4",
          "line-opacity": 0.5,
          "line-width": 1.333,
        },
        order: 10001,
      },
      {
        id: "road-primary",
        type: "line",
        source: "basemap-vector",
        "source-layer": "road",
        filter: ["==", ["get", "type"], "P"],
        paint: {
          "line-color": "#a4a4a4",
          "line-width": 1.333,
        },
        order: 10002,
      },
      {
        id: "label",
        type: "symbol",
        source: "basemap-vector",
        "source-layer": "label",
        layout: {
          "text-field": ["get", "text"],
          "text-size": ["case", ["==", "community", ["get", "type"]], 16, 13],
          "text-font": [
            "case",
            ["==", "community", ["get", "type"]],
            ["literal", ["Franklin Gothic Demi Regular"]],
            ["literal", ["Franklin Gothic Book Regular"]],
          ],
        },
        paint: {
          "text-color": "#444444",
        },
        order: 100000,
      },
    ],
  };
}

export function rasterStyle({ getServiceName, order = 60000 }) {
  return function (entry) {
    const serviceName = getServiceName(entry);
    if (!serviceName) return { sources: {}, layers: [] };
    return {
      sources: {
        [serviceName]: rasterSource(serviceName),
      },
      layers: [
        {
          id: serviceName,
          type: "raster",
          source: serviceName,
          order,
        },
      ],
    };
  };
}
