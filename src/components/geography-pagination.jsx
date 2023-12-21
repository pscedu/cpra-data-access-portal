import { useContext } from "preact/hooks";
import { State } from "../helpers/state";

// Pagination controls for selecting the previous/next geography or batch.
export default function GeographyPagination({ maxGeographies = 10 }) {
  const { geographies } = useContext(State);
  const prevLabel = `Previous ${maxGeographies} Selections`;
  const nextLabel = `Next ${maxGeographies} selections`;
  const geos = geographies.value;

  const rotateGeographies = (offset) => {
    if (offset != 0)
      geographies.value = [...geos.slice(offset), ...geos.slice(0, offset)];
  };

  return (
    <>
      <button
        type="button"
        class="btn btn-sm btn-outline-dark ms-2"
        title={prevLabel}
        aria-label={prevLabel}
        onClick={() => rotateGeographies(maxGeographies * -1)}
        disabled={geos.length <= maxGeographies}
      >
        <i class="bi bi-chevron-double-left" />
      </button>
      <button
        type="button"
        class="btn btn-sm btn-outline-dark ms-2"
        title="Previous Selection"
        aria-label="Previous Selection"
        onClick={() => rotateGeographies(-1)}
      >
        <i class="bi bi-chevron-left" />
      </button>
      <button
        type="button"
        class="btn btn-sm btn-outline-dark ms-2"
        title="Next Selection"
        aria-label="Next Selection"
        onClick={() => rotateGeographies(1)}
      >
        <i class="bi bi-chevron-right" />
      </button>
      <button
        type="button"
        class="btn btn-sm btn-outline-dark ms-2"
        title={nextLabel}
        aria-label={nextLabel}
        onClick={() => rotateGeographies(maxGeographies)}
        disabled={geos.length <= maxGeographies}
      >
        <i class="bi bi-chevron-double-right" />
      </button>
    </>
  );
}
