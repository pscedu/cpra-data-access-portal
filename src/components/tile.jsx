// Featured dataset tile.
const Tile = ({ spec }) => {
  const formats = new Set(
    spec.fileFormats.map((format) => format.abbreviation || format.title)
  );
  return (
    <div class="card mb-3">
      <div class="card-body">
        <h2 class="fs-5 card-title">
          <a href={`/dataset/${spec.id}`}>{spec.title}</a>
        </h2>
      </div>
      <div class="card-footer">
        {Array.from(formats).map((format) => (
          <span
            key={format}
            class={`badge rounded-pill me-1 format-${format.toLowerCase()}`}
          >
            {format}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Tile;
