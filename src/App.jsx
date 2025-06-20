import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Old from "./Updated dashboard v11";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./provider/AuthProvider";
import ProductManagementPage from "./components/ProductManagementPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<h1>404</h1>} />
          <Route path="/old" element={<Old />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
