import { useId } from "preact/hooks";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import ReactTooltip from "react-bootstrap/Tooltip";

// Tooltip for displaying help text.
export default function Tooltip({ children, icon = "info" }) {
  const id = useId();
  return (
    <OverlayTrigger overlay={<ReactTooltip id={id}>{children}</ReactTooltip>}>
      <i
        class={`bi bi-${icon}`}
        style={{
          background: "#ddd",
          borderRadius: "0.75rem",
          color: "#666",
          display: "inline-block",
          fontSize: "60%",
          height: "1.5rem",
          margin: "0 10px",
          paddingTop: "0.25rem",
          textAlign: "center",
          verticalAlign: "middle",
          width: "1.5rem",
        }}
      />
    </OverlayTrigger>
  );
}
