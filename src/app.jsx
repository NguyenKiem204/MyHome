// src/main.jsx
// React core
import React from "react";
import { createRoot } from "react-dom/client";

// ZaUI stylesheet
import "zmp-ui/zaui.css";

// Tailwind stylesheet
import "./css/tailwind.scss";

// Your stylesheet
import "./css/app.scss";

// Expose app configuration
import appConfig from "../app-config.json";
if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig;
}

import Layout from "./components/Layout/Layout";
import { App as ZMPApp, ZMPRouter } from "zmp-ui";
import { getSystemInfo } from "zmp-sdk";

const root = createRoot(document.getElementById("app"));

root.render(
  <React.StrictMode>
    <ZMPApp theme={getSystemInfo().zaloTheme}>
      <ZMPRouter>
        <Layout />
      </ZMPRouter>         
    </ZMPApp>
  </React.StrictMode>
);