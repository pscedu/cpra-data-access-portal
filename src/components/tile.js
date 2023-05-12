import { h } from "preact";
import { Link } from "preact-router";

const Tile = ({ spec }) => (
  <div class="card mb-3">
    <div class="card-body">
      <h2 class="fs-5 card-title">
        <Link href={`/dataset/${spec.id}`}>{spec.title}</Link>
      </h2>
    </div>
    <div class="card-footer">
      {spec.fileFormats.map((format) => (
        <span key={format} class="badge rounded-pill text-bg-secondary me-1">
          {format.title}
        </span>
      ))}
    </div>
  </div>
);

export default Tile;
