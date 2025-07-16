import React from "react";
import { createRoot } from "react-dom/client";
import "zmp-ui/zaui.css";
import "./css/tailwind.scss";
import "./css/app.scss";
import appConfig from "../app-config.json";

if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig;
}

import Layout from "./layout/Layout";
import Routes from "./routes/index.jsx";
import { App as ZMPApp, ZMPRouter } from "zmp-ui";
import { getSystemInfo } from "zmp-sdk";

const root = createRoot(document.getElementById("app"));

root.render(
  <React.StrictMode>
    <ZMPApp theme={getSystemInfo().zaloTheme}>
      <ZMPRouter>
        <Layout>
          <Routes />
        </Layout>
      </ZMPRouter>
    </ZMPApp>
  </React.StrictMode>
);
