import { h } from "preact";
import { batch } from "@preact/signals";
import { useContext, useEffect, useLayoutEffect, useRef } from "preact/hooks";
import { State } from "../helpers/state";

function initMap(container, geographicUnit, geographies, maps) {
  // eslint-disable-next-line no-undef
  const map = new maplibregl.Map({
    container,
    style: {
      version: 8,
      sources: {},
      layers: [],
      transition: {
        duration: 0,
        delay: 0,
      },
    },
    center: [-91.51, 29.106],
    zoom: 6.5,
  });

  // Add map event handlers.
  map.on("load", () => {
    for (let id of geographies.peek()) {
      map.setFeatureState(
        { source: "geography-vector", sourceLayer: geographicUnit, id },
        { selected: "true" }
      );
    }
  });

  ["geography-fill", "geography-line", "geography-selected"].forEach(
    (layerName) => {
      map.on("click", layerName, (e) => {
        if (e.features) {
          const newGeographies = geographies.peek().slice();
          for (let feature of e.features) {
            let idx = newGeographies.indexOf(feature.id);
            if (idx === -1) {
              newGeographies.push(feature.id);
              for (let m of maps.peek())
                m.setFeatureState(feature, { selected: "true" });
            } else {
              newGeographies.splice(idx, 1);
              for (let m of maps.peek())
                m.removeFeatureState(feature, "selected");
            }
          }
          geographies.value = newGeographies;
        }
      });
      map.on(
        "mousemove",
        layerName,
        () => (map.getCanvas().style.cursor = "pointer")
      );
      map.on(
        "mouseleave",
        layerName,
        () => (map.getCanvas().style.cursor = "")
      );
    }
  );

  return map;
}

export default function Map() {
  const { compare, geographies, maps, scenarios } = useContext(State);

  const compareContainer = useRef();
  const beforeContainer = useRef();
  const afterContainer = useRef();

  const single = scenarios.value.length == 1;
  const { geographicUnit } = scenarios.value[0];

  // Initialize the map(s) and compare controls when the number of
  // scenarios changes.
  useLayoutEffect(() => {
    const glMaps = [];
    const beforeMap =
      maps.value[0] ||
      initMap(beforeContainer.current, geographicUnit, geographies, maps);
    glMaps.push(beforeMap);

    if (single) {
      if (compare.value) compare.value.remove();
    } else {
      const afterMap =
        maps.value[1] ||
        initMap(afterContainer.current, geographicUnit, geographies, maps);
      glMaps.push(afterMap);

      // eslint-disable-next-line no-undef
      compare.value = new maplibregl.Compare(
        beforeMap,
        afterMap,
        compareContainer.current,
        {
          vertical: true,
        }
      );
    }
    if (glMaps.length > maps.value.length) maps.value = glMaps;
  }, [single]);

  // Clean up state before the component unloads.
  useEffect(() => {
    return () => {
      if (compare.value) compare.value.remove();
      maps.value.forEach((map) => map.remove());
      batch(() => {
        compare.value = null;
        maps.value = [];
      });
    };
  }, []);

  const mapCss = {
    bottom: 0,
    position: "absolute",
    top: 0,
    width: "100%",
  };

  return (
    <div
      ref={compareContainer}
      style={{
        border: "1px solid #cccccc",
        height: "500px",
        margin: "0 0 1rem",
        position: "relative",
        width: "100%",
      }}
    >
      <div style={mapCss} ref={beforeContainer} />
      <div
        style={{ ...mapCss, display: single ? "none" : "block" }}
        ref={afterContainer}
      />
    </div>
  );
}
