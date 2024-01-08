// Featured dataset tile.
const Tile = ({ spec }) => {
  const formats = new Set(
    spec.fileFormats.map((format) => format.abbreviation || format.title)
  );
  return (
    <div class="card mb-3">
      <a
        href={`/dataset/${spec.id}`}
        class="card-body d-flex"
        style={{
          aspectRatio: "7 / 3",
          backgroundImage: `url(/images/${spec.id}.jpg)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% auto",
        }}
      ></a>
      <div class="card-footer d-flex flex-row justify-content-between">
        <>
          <a class="fw-bold" href={`/dataset/${spec.id}`}>
            {spec.title}
          </a>
          <span>
            {Array.from(formats).map((format) => (
              <span
                key={format}
                class={`badge rounded-pill me-1 format-${format.toLowerCase()}`}
              >
                {format}
              </span>
            ))}
          </span>
        </>
      </div>
    </div>
  );
};

export default Tile;
