import { h } from "preact";

const Header = () => (
  <header>
    <nav class="navbar navbar-expand-lg bg-light">
      <div class="container">
        <a class="navbar-brand" href="/">
          Louisiana&apos;s Coastal Master Plan 2023: Data Access Portal
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar-content"
          aria-controls="navbar-content"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon" />
        </button>
        <div class="collapse navbar-collapse" id="navbar-content">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" href="https://mpdv.coastal.la.gov">
                Data Viewer
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                href="https://coastal.la.gov/our-plan/2023-coastal-master-plan/"
              >
                Master Plan Document
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="https://coastal.la.gov/">
                CPRA
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
);

export default Header;
