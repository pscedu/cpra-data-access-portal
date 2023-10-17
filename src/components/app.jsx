import { LocationProvider, Router, Route, lazy } from "preact-iso";
import { createState, State } from "../helpers/state";
import { writeHash } from "../helpers/hash";

import Header from "./header";
import Intro from "./intro";

// Code-splitting is automated for `routes` directory
const Home = lazy(() => import("../routes/home"));
const Dataset = lazy(() => import("../routes/dataset"));
const StaticPage = lazy(() => import("../routes/static-page"));

const App = () => {
  const state = createState();
  const handleRouteChange = (url) => {
    if (/^\/dataset\//.test(url)) {
      const dataset = url.replace(/^\/dataset\//, "");
      if (state.scenarios.value[0].dataset != dataset)
        state.updateScenarios({ dataset });
      writeHash(state.scenarios.value, state.geographies.value);
    }
  };
  return (
    <State.Provider value={state}>
      <LocationProvider>
        <div id="app">
          <Header />
          <main class="container mt-3 mb-3">
            <Router onRouteChange={handleRouteChange}>
              <Route component={Home} path="/" />
              <Route
                component={StaticPage}
                path="/dataset/"
                contentUrl="/documentation.html"
              />
              <Route component={Dataset} path="/dataset/:datasetId" />
            </Router>
          </main>
        </div>
        <Intro />
      </LocationProvider>
    </State.Provider>
  );
};

export default App;
