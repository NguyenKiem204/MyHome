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

// Mount the app
import Layout from "./components/Layout/Layout";
// Import ZMPApp và ZMPRouter
import { App as ZMPApp, ZMPRouter } from "zmp-ui";
import { getSystemInfo } from "zmp-sdk"; // Cần import để lấy theme Zalo

const root = createRoot(document.getElementById("app"));

root.render(
  <React.StrictMode>
    {/* ZMPApp là thành phần gốc của ZMP-UI, cung cấp theme và context */}
    <ZMPApp theme={getSystemInfo().zaloTheme}>
      {/* ZMPRouter phải nằm bên trong ZMPApp và bao bọc tất cả các component sử dụng hook định tuyến */}
      <ZMPRouter>
        <Layout /> {/* Component Layout của bạn */}
      </ZMPRouter>         
    </ZMPApp>
  </React.StrictMode>
);