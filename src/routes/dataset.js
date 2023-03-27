import { h } from "preact";
import { datasetsMap } from "../helpers/config";

const Dataset = ({ datasetId }) => {
  const spec = datasetsMap[datasetId];
  return (
    <>
      <h2>{spec.title}</h2>
    </>
  );
};

export default Dataset;
