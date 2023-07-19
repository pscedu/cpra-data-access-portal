import { h } from "preact";
import { batch } from "@preact/signals";
import { useContext, useEffect, useLayoutEffect, useRef } from "preact/hooks";
import { State } from "../helpers/state";
import Legend from "./legend";

export default function Map() {
  const { compare, initMap, maps, scenarios } = useContext(State);

  const compareContainer = useRef();
  const beforeContainer = useRef();
  const afterContainer = useRef();

  const single = scenarios.value.length == 1;

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
      <Legend />
    </div>
  );
}
