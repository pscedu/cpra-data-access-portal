import { h } from "preact";
import { Router } from "preact-router";

import Header from "./header";

// Code-splitting is automated for `routes` directory
import Home from "../routes/home";
import Dataset from "../routes/dataset";

const App = () => (
  <div id="app">
    <Header />
    <main class="container mt-3 mb-3">
      <Router>
        <Home path="/" />
        <Dataset path="/dataset/" datasetId="default" />
        <Dataset path="/dataset/:datasetId" />
      </Router>
    </main>
  </div>
);

export default App;
