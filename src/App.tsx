import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import UserManagementPage from "./pages/UserManagementPage";
import UserEditPage from "./pages/UserEditPage";
import TotalAccessHistoryPage from "./pages/TotalAccessHistoryPage";
import CarForm from "./pages/CarForm";
import CarEditForm from "./pages/CarEditForm";
import UserAccessHistoryPage from "./pages/UserAccessHistoryPage";

const ProtectedRoute: React.FC<{ element: React.ReactNode; allowedRoles?: string[] }> = ({
  element,
  allowedRoles,
}) => {
  const authToken = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  if (!authToken) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{element}</>;
};

const DashboardRouter = () => {
  const userRole = localStorage.getItem("userRole");

  if (userRole === "admin") {
    return <AdminDashboard />;
  } else if (userRole === "user") {
    return <UserDashboard />;
  } else {
    return <Navigate to="/" replace />;
  }
};

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<DashboardRouter />} allowedRoles={["user", "admin"]} />}
        />
        <Route
          path="/users"
          element={<ProtectedRoute element={<UserManagementPage />} allowedRoles={["admin"]} />}
        />
        <Route
          path="/users/edit/:id"
          element={<ProtectedRoute element={<UserEditPage />} allowedRoles={["admin"]} />}
        />
        <Route
          path="/history/total"
          element={<ProtectedRoute element={<TotalAccessHistoryPage />} allowedRoles={["admin"]} />}
        />
        <Route
          path="/cars/new"
          element={<ProtectedRoute element={<CarForm />} allowedRoles={["user"]} />}
        />
        <Route
          path="/cars/edit/:id"
          element={<ProtectedRoute element={<CarEditForm />} allowedRoles={["user"]} />}
        />
        <Route
          path="/cars/history"
          element={<ProtectedRoute element={<UserAccessHistoryPage />} allowedRoles={["user"]} />}
        />
        <Route
          path="/cars/:carId/history"
          element={<ProtectedRoute element={<UserAccessHistoryPage />} allowedRoles={["user"]} />}
        />

        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen bg-gray-100">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
                <p className="text-xl text-gray-700 mb-6">Página não encontrada</p>
                <a
                  href="/dashboard"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
                >
                  Voltar
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;
