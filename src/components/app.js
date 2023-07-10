import { h } from "preact";
import { Router } from "preact-router";
import { createState, State } from "../helpers/state";

import Header from "./header";

// Code-splitting is automated for `routes` directory
import Home from "../routes/home";
import Dataset from "../routes/dataset";

const App = () => {
  const state = createState();
  const handleRouteChange = ({ url, previous, router }) => {
    if (/^\/files\//.test(url)) {
      router.routeTo(previous);
    } else if (/^\/dataset\//.test(url)) {
      const dataset = url.replace(/^\/dataset\//, "");
      if (state.scenarios.value[0].dataset != dataset)
        state.updateScenarios({ dataset });
    }
  };
  return (
    <State.Provider value={state}>
      <div id="app">
        <Header />
        <main class="container mt-3 mb-3">
          <Router onChange={handleRouteChange}>
            <Home path="/" />
            <Dataset path="/dataset/" datasetId="default" />
            <Dataset path="/dataset/:datasetId" />
          </Router>
        </main>
      </div>
    </State.Provider>
  );
};

export default App;
