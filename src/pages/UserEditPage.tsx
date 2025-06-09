import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token || !id) {
      navigate("/");
      return;
    }

    fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.username);
        setRole(data.role);
      })
      .catch(() => {
        toast.error("Erro ao carregar usuário.");
      });
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, role }),
      });

      if (response.ok) {
        toast.success("Usuário atualizado.");
        navigate("/users");
      } else {
        toast.error("Erro ao atualizar usuário.");
      }
    } catch {
      toast.error("Erro de conexão.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Editar Usuário</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Nome de Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Perfil</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/users")}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserEditPage;
