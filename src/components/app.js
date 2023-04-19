import { h } from "preact";
import { Router } from "preact-router";
import { createState, State } from "../helpers/state";

import Header from "./header";

// Code-splitting is automated for `routes` directory
import Home from "../routes/home";
import Dataset from "../routes/dataset";

const App = () => {
  const state = createState();
  const handleRouteChange = (e) => {
    state.datasetId.value = /^\/dataset\//.test(e.url)
      ? e.url.replace(/^\/dataset\//, "")
      : null;
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
