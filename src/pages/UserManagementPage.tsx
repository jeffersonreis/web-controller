import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/");
      return;
    }

    fetchUsers(token);
  }, [navigate]);

  const fetchUsers = async (token: string) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const filtered = data.filter((user: any) => user.role !== "admin");
        setUsers(filtered);
      } else {
        toast.error("Erro ao carregar usuários.");
      }
    } catch {
      toast.error("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleEditUser = (id: number) => {
    navigate(`/users/edit/${id}`);
  };

  const handleDeleteUser = async (id: number) => {
    const confirmed = confirm("Tem certeza que deseja excluir este usuário?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Usuário excluído com sucesso.");
        setUsers((prev) => prev.filter((user) => user.id !== id));
      } else {
        toast.error("Erro ao excluir usuário.");
      }
    } catch {
      toast.error("Erro de conexão.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-700">Carregando usuários...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Usuários</h2>

        {users.length === 0 ? (
          <p className="text-gray-600">Nenhum usuário encontrado.</p>
        ) : (
          <ul className="space-y-4">
            {users.map((user) => (
              <li
                key={user.id}
                className="bg-gray-50 p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-800">{user.username}</p>
                  <p className="text-gray-600 text-sm">{user.role}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditUser(user.id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 hover:bg-red-700 text-white text-sm py-1 px-3 rounded"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={handleBack}
          className="mt-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}

export default UserManagementPage;
