import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App.tsx";
import Map from "./Map.tsx";
import TemporalExtent from "./TemporalAndSpatialFilters.tsx";
import SpatialFilter from "./SpatialFilter.tsx";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <TemporalExtent />
  </StrictMode>
);