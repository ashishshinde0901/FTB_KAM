import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./components/layout/DashboardLayout"; // Updated path if you moved it
import Accounts from "./pages/Accounts";
import AccountDetail from "./pages/AccountDetail";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Updates from "./pages/Updates";
import React from "react";
import UpdateDetail from "./pages/UpdateDetail";  
import AccountCreation from "./pages/AccountCreation";
import ProjectCreation from "./pages/ProjectCreation";
import UpdateCreation from "./pages/UpdateCreation";

function PrivateRoute({ children }) {
  const secretKey = localStorage.getItem("secretKey");
  if (!secretKey) {
    // console.warn("[App] No secretKey found, redirecting to /login"); // Already in original
    return <Navigate to="/login" />;
  }
  return children;
}

export default function App() {
  React.useEffect(() => {
    // console.log("[App] App mounted"); // Already in original
  }, []);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        {/* Nested routes render inside DashboardLayout's Outlet */}
        <Route index element={<Accounts />} /> {/* Default for / */}
        <Route path="accounts/:id" element={<AccountDetail />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="updates" element={<Updates />} />
        <Route path="updates/:id" element={<UpdateDetail />} />
        <Route path="create-account" element={<AccountCreation />} />
        <Route path="create-project" element={<ProjectCreation />} />
        <Route path="create-update" element={<UpdateCreation />} />

        {/* Add a /profile route if you want the "My Profile" link to work */}
        {/* <Route path="profile" element={<div>User Profile Page</div>} /> */}
      </Route>
    </Routes>
  );
}