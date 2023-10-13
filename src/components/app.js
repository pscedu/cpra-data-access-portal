import { h } from "preact";
import { Router } from "preact-router";
import { createState, State } from "../helpers/state";
import { writeHash } from "../helpers/hash";

import Header from "./header";
import Intro from "./intro";

// Code-splitting is automated for `routes` directory
import Home from "../routes/home";
import Dataset from "../routes/dataset";
import StaticPage from "../routes/static-page";

const App = () => {
  const state = createState();
  const handleRouteChange = ({ url }) => {
    if (/^\/dataset\//.test(url)) {
      const dataset = url.replace(/^\/dataset\//, "");
      if (state.scenarios.value[0].dataset != dataset)
        state.updateScenarios({ dataset });
      writeHash(state.scenarios.value, state.geographies.value);
    }
  };
  return (
    <State.Provider value={state}>
      <div id="app">
        <Header />
        <main class="container mt-3 mb-3">
          <Router onChange={handleRouteChange}>
            <Home path="/" />
            <StaticPage
              path="/dataset/"
              contentUrl="/assets/documentation.html"
            />
            <Dataset path="/dataset/:datasetId" />
          </Router>
        </main>
      </div>
      <Intro />
    </State.Provider>
  );
};

export default App;
