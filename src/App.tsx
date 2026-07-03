/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter } from "react-router-dom";
import { ToastProvider } from "./contexts/ToastContext.js";
import { AuthProvider } from "./contexts/AuthContext.js";
import AppRoutes from "./routes/index.js";

export default function App() {
  return (
    <HashRouter>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </HashRouter>
  );
}
