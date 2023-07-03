import { h } from "preact";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const Header = () => (
  <header>
    <Navbar expand="xl" className="bg-light">
      <div class="container d-flex justify-content-between">
        <a
          class="navbar-brand font-heading text-uppercase text-primary"
          href="/"
        >
          <img src="/assets/images/logo.png" alt="CPRA" />
          <span class="plan-name">
            Louisiana&apos;s 2023 Coastal Master Plan:{" "}
          </span>
          <strong>Data Access Portal</strong>
        </a>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav" className="justify-content-end">
          <Nav>
            <Nav.Link href="https://mpdv.coastal.la.gov">Data Viewer</Nav.Link>
            <Nav.Link href="https://coastal.la.gov/our-plan/2023-coastal-master-plan/">
              Master Plan Document
            </Nav.Link>
            <Nav.Link href="https://coastal.la.gov/">CPRA</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  </header>
);

export default Header;
