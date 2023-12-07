import { batch } from "@preact/signals";
import { useContext, useEffect, useLayoutEffect, useRef } from "preact/hooks";
import { Map as GLMap } from "maplibre-gl";
import GLCompare from "@maplibre/maplibre-gl-compare";
import { State } from "../helpers/state";
import Legend from "./legend";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-compare/dist/maplibre-gl-compare.css";

export default function Map() {
  const {
    compare,
    contextMenu,
    getMapStyle,
    geographies,
    mapDataLoading,
    maps,
    scenarios,
  } = useContext(State);

  const compareContainer = useRef();
  const beforeContainer = useRef();
  const afterContainer = useRef();

  const single = scenarios.value.length == 1;

  const initMap = (container) => {
    const firstMap = maps.value[0];
    const mapIdx = firstMap ? 1 : 0;
    const map = new GLMap({
      container,
      center: firstMap ? firstMap.getCenter() : [-91.5, 29.75],
      hash: mapIdx == 0 ? "map" : null,
      style: getMapStyle(mapIdx),
      zoom: firstMap ? firstMap.getZoom() : 6.5,
    });

    // Add map event handlers.
    map.on("data", () => {});

    map.on("contextmenu", "geography-fill", (e) => {
      contextMenu.value = {
        type: "geography-select",
        feature: e.features[0],
        x: e.originalEvent.clientX,
        y: e.originalEvent.clientY,
      };
    });

    map.on("click", "geography-fill", (e) => {
      if (e.features) {
        const newGeographies = geographies.peek().slice();
        for (let feature of e.features) {
          let idx = newGeographies.indexOf(feature.id);
          idx === -1
            ? newGeographies.push(feature.id)
            : newGeographies.splice(idx, 1);
        }
        geographies.value = newGeographies;
      }
    });
    map.on(
      "mousemove",
      "geography-fill",
      () => (map.getCanvas().style.cursor = "pointer")
    );
    map.on(
      "mouseleave",
      "geography-fill",
      () => (map.getCanvas().style.cursor = "")
    );

    return map;
  };

  // Initialize the map(s) and compare controls when the number of
  // scenarios changes.
  useLayoutEffect(() => {
    const glMaps = [];
    const beforeMap = maps.value[0] || initMap(beforeContainer.current);
    glMaps.push(beforeMap);

    if (single) {
      if (compare.value) compare.value.remove();
    } else {
      const afterMap = maps.value[1] || initMap(afterContainer.current);
      glMaps.push(afterMap);

      compare.value = new GLCompare(
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
      <Legend />
      {mapDataLoading.value ? (
        <div
          class="spinner-border"
          role="status"
          style={{ position: "absolute", left: "10px", top: "10px" }}
        >
          <span class="visually-hidden">Loading...</span>
        </div>
      ) : null}
    </div>
  );
}
