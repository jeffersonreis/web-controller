// src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaSignOutAlt, FaUsers, FaHistory } from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const storedUsername = localStorage.getItem("loggedInUsername");
    const storedRole = localStorage.getItem("userRole");

    if (!authToken || !storedUsername || !storedRole || storedRole !== "admin") {
      handleLogout();
      toast("Acesso negado ou sessão inválida.", { icon: "⚠️" });
    } else {
      setLoggedInUsername(storedUsername);
      setUserRole(storedRole);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedInUsername");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    toast.success("Logout realizado com sucesso!");
    navigate("/");
  };

  const handleGoUsers = () => {
    navigate("/users");
  };

  const handleViewTotalHistory = () => {
    navigate("/history/total");
  };

  if (!localStorage.getItem("authToken") || userRole !== "admin") {
    return null;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl text-center">
        <button
          onClick={handleLogout}
          className="mb-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center mx-auto focus:outline-none focus:shadow-outline"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Bem-vindo, Admin {loggedInUsername}!
        </h2>
        <p className="text-gray-600 mb-8">
          Painel de administração do sistema.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div
            className="bg-blue-50 p-6 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition"
            onClick={handleGoUsers}
          >
            <h3 className="text-xl font-semibold text-blue-800 mb-2 flex items-center">
              <FaUsers className="mr-2" /> Gerenciar Usuários
            </h3>
            <p className="text-gray-700 text-sm">
              Visualize e edite os usuários do sistema.
            </p>
          </div>
          <div
            className="bg-purple-50 p-6 rounded-lg border border-purple-200 flex flex-col justify-between cursor-pointer hover:bg-purple-100 transition"
            onClick={handleViewTotalHistory}
          >
            <h3 className="text-xl font-semibold text-purple-800 mb-2 flex items-center">
              <FaHistory className="mr-2" /> Histórico de Acesso Total
            </h3>
            <p className="text-purple-700 text-sm mb-2">
              Visualize todos os registros de acesso do sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
