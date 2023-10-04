import { h } from "preact";
import { useContext } from "preact/hooks";
import { State } from "../helpers/state";
import { catalog } from "../helpers/catalog";

const NoDataMessage = () => {
  const { geographicUnit } = useContext(State);
  if (geographicUnit.value == undefined) return <>Select a different year</>;

  return (
    <>
      Select at least one{" "}
      {catalog.format(geographicUnit.value, "geographicUnit").toLowerCase()}
    </>
  );
};

export default NoDataMessage;
