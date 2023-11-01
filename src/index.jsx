import { render } from "preact";
import App from "./components/app";
import "./style/index.scss";
import { initAnalytics } from "./helpers/analytics";

render(<App />, document.getElementById("mpdap"));
initAnalytics("G-3NFZGBTY64");
