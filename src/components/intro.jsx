import { route } from "preact-router";
import { useContext } from "preact/hooks";
import { State } from "../helpers/state";

import Modal from "react-bootstrap/Modal";

export default function Intro() {
  const { showIntro } = useContext(State);

  const dismiss = () => (showIntro.value = false);
  const goToDocs = () => {
    dismiss();
    route("/dataset/");
  };

  return (
    <Modal centered size="lg" show={showIntro.value} onHide={dismiss}>
      <Modal.Header closeButton>
        <Modal.Title>
          Welcome to the 2023 Coastal Master Plan Data Access Portal
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Welcome to the 2023 Coastal Master Plan Data Access Portal (MP-DAP).
          This portal was developed to enable online visualization and download
          access to many of the modeling data sets used to develop the 2023
          master plan. This is an initial release of the MP-DAP; additional
          datasets and increased functionality will be added in the coming
          months.
        </p>
        <p>
          Please review the{" "}
          <a href="/dataset/" onClick={dismiss}>
            MP-DAP documentation
          </a>{" "}
          to gain an understanding of the variety of datasets currently
          available in the MP-DAP. Additional reports that document the modeling
          tools, as well as discussions of modeling results are available online
          in the{" "}
          <a href="https://coastal.la.gov/our-plan/2023-coastal-master-plan/2023-plan-appendices/">
            plan appendices
          </a>
          .
        </p>
        <p>
          For questions, comments, or suggestions regarding the MP-DAP, please
          e-mail <a href="mailto:masterplan@la.gov">masterplan@la.gov</a>.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <div class="d-flex">
          <button class="btn btn-secondary me-2" onClick={goToDocs}>
            <i class="bi bi-book me-2" />
            Read the Documentation
          </button>
          <button class="btn btn-primary" onClick={dismiss}>
            <i class="bi bi-box-arrow-in-right me-2" />
            Access the Data
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
