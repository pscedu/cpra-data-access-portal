import { useContext } from "preact/hooks";
import { State } from "../helpers/state";

import Offcanvas from "react-bootstrap/Offcanvas";

import Options from "./options";
import Scenarios from "./scenarios";

// Sidebar containing scenario options. It uses the Bootstrap Offcanvas component
// to allow for responsive behavior.
const Sidebar = () => {
  const { scenarios, showSidebar } = useContext(State);
  return (
    <>
      <Offcanvas
        show={showSidebar.value}
        onHide={() => (showSidebar.value = false)}
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
