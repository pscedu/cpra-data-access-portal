import { h } from "preact";
import { useContext } from "preact/hooks";
import { State } from "../helpers/state";
import { getLevel } from "../helpers/catalog";

const NoDataMessage = () => {
  const { geographicUnit } = useContext(State);
  if (geographicUnit.value == "undefined") return <>Select a different year</>;

  const formatUnit = getLevel("geographicUnit").format;
  return (
    <>Select at least one {formatUnit(geographicUnit.value).toLowerCase()}</>
  );
};

export default NoDataMessage;
