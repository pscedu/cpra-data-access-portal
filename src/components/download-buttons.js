import { h } from "preact";
import { scenarioName } from "../helpers/utils";

import { Dropdown } from "react-bootstrap";

const formatContent = (fileFormat, text) => [
  fileFormat.icon ? <i class={`bi bi-${fileFormat.icon} me-1`} /> : null,
  text,
];

const DownloadButtons = ({
  dataset,
  scenarios,
  geographies,
  dropdown = true,
  classes = "ms-2",
}) => {
  const options = [];

  for (let fileFormat of dataset.fileFormats) {
    let urls = Array.from(
      new Set(fileFormat.getUrls(dataset, scenarios, geographies))
    );
    for (let urlIdx in urls) {
      let url = urls[urlIdx];
      let postfix =
        urls.length > 1 ? ` ${scenarioName(scenarios[urlIdx], true)}` : "";
      options.push([fileFormat, url, `${fileFormat.title}${postfix}`]);
    }
  }

  if (!options.length) return;
  if (options.length > 1 && dropdown) {
    const menuItems = options.map(([fileFormat, url, text]) => (
      <Dropdown.Item key={url} href={url}>
        {formatContent(fileFormat, text)}
      </Dropdown.Item>
    ));
    return (
      <Dropdown className={classes}>
        <Dropdown.Toggle
          variant="none"
          className={`format-${options[0][0].id}`}
          id={`${dataset.id}-download`}
          title={dataset.description}
        >
          <i class="bi bi-download" /> {dataset.title}
        </Dropdown.Toggle>
        <Dropdown.Menu>{menuItems}</Dropdown.Menu>
      </Dropdown>
    );
  }
  return options.map(([fileFormat, url, text]) => (
    <a
      key={url}
      href={url}
      class={`btn format-${fileFormat.id} ${classes}`}
      title={dataset.description}
    >
      {formatContent(fileFormat, text)}
    </a>
  ));
};

export default DownloadButtons;
