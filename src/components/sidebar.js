import { h } from "preact";
import { useSignal } from "@preact/signals";

import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

import Options from "./options";
import Scenarios from "./scenarios";

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
          <div class="w-100">
            <Options
              datasetSpec={datasetSpec}
              scope="global"
              excluded={["timeValue"]}
            />
            <Scenarios datasetSpec={datasetSpec} />
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
