import { h } from "preact";
import { useSignal } from "@preact/signals";

import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

const Sidebar = ({ datasetSpec }) => {
  const show = useSignal(false);
  return (
    <>
      <Button
        variant="outline-dark"
        className="d-lg-none"
        onClick={() => (show.value = true)}
        title="Show dataset options"
      >
        <i class="bi bi-tools" />
      </Button>
      <Offcanvas
        show={show.value}
        onHide={() => (show.value = false)}
        responsive="lg"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Dataset Options</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <p>Sidebar content</p>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
