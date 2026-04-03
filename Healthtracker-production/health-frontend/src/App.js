import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddHealth from "./pages/AddHealth";
import Report from "./pages/Report";
import Profile from "./pages/Profile";
import TreatmentList from "./pages/TreatmentList";
import AddTreatment from "./pages/AddTreatment";
import TreatmentDetails from "./pages/TreatmentDetails";


import ProtectedRoute from "./components/ProtectedRoute";
import AuthLayout from "./layouts/AuthLayout";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AuthLayout><Dashboard /></AuthLayout>
        </ProtectedRoute>
      } />

      <Route path="/add" element={
        <ProtectedRoute>
          <AuthLayout><AddHealth /></AuthLayout>
        </ProtectedRoute>
      } />

      <Route path="/report" element={
        <ProtectedRoute>
          <AuthLayout><Report /></AuthLayout>
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <AuthLayout><Profile /></AuthLayout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" />} />

      <Route path="/treatments" element={
  <ProtectedRoute>
    <AuthLayout>
      <TreatmentList />
    </AuthLayout>
  </ProtectedRoute>
} />

<Route path="/treatments/new" element={
  <ProtectedRoute>
    <AuthLayout>
      <AddTreatment />
    </AuthLayout>
  </ProtectedRoute>
} />

<Route
  path="/treatments/:id"
  element={
    <ProtectedRoute>
      <AuthLayout>
        <TreatmentDetails />
      </AuthLayout>
    </ProtectedRoute>
  }
/>

    </Routes>
    
  );
}

export default App;

