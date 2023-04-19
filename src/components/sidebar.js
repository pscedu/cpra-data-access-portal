import { h } from "preact";
import { useSignal } from "@preact/signals";
import { useContext } from "preact/hooks";
import { State } from "../helpers/state";

import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

import Options from "./options";
import Scenarios from "./scenarios";

const Sidebar = () => {
  const { scenarios } = useContext(State);
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
              scenario={scenarios.value[0]}
              scope="global"
              excluded={["timeValue"]}
            />
            <Scenarios />
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
