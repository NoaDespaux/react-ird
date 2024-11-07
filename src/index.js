import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import Map from "./Map.tsx";
import SpatialFilter from "./SpatialFilter.tsx";
import FiltersMap from "./TemporalAndSpatialFilters.tsx";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <FiltersMap />
  </StrictMode>
);