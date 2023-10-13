import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const emailClick = () =>
  (window.location = ["mai", ["masterplan", "la.gov"].join("@")].join("lto:"));

const Header = () => (
  <header>
    <Navbar expand="xl" className="bg-light">
      <div class="container d-flex justify-content-between">
        <a
          class="navbar-brand font-heading text-uppercase text-primary"
          href="/"
        >
          <img src="/images/logo.png" alt="CPRA" />
          <span class="plan-name">
            Louisiana&apos;s 2023 Coastal Master Plan:{" "}
          </span>
          <strong>Data Access Portal</strong>
        </a>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav" className="justify-content-end">
          <Nav>
            <Nav.Link href="https://mpdv.coastal.la.gov">
              <i class="bi bi-box-arrow-up-right me-1" />
              Data Viewer
            </Nav.Link>
            <Nav.Link href="https://coastal.la.gov/our-plan/2023-coastal-master-plan/">
              <i class="bi bi-box-arrow-up-right me-1" />
              Master Plan
            </Nav.Link>
            <Nav.Link onClick={emailClick}>
              <i class="bi bi-envelope me-1" />
              Contact
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  </header>
);

export default Header;
