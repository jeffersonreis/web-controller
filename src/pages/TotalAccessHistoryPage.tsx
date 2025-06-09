import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";

function TotalAccessHistoryPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [plate, setPlate] = useState("");
  const [user, setUser] = useState("");
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/");
      return;
    }
    fetchLogs(token);
  }, [navigate]);

  const fetchLogs = async (token: string) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/access-history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      } else {
        toast.error("Erro ao carregar histórico.");
      }
    } catch {
      toast.error("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  const userOptions = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((log) => {
      if (log.user?.username) set.add(log.user.username);
    });
    return Array.from(set).sort();
  }, [logs]);

  useEffect(() => {
    let filtered = logs;

    if (start) {
      const startDate = new Date(start);
      filtered = filtered.filter((log) => new Date(log.timestamp) >= startDate);
    }

    if (end) {
      const endDate = new Date(end);
      filtered = filtered.filter((log) => new Date(log.timestamp) <= endDate);
    }

    if (plate.trim()) {
      filtered = filtered.filter((log) =>
        log.plate?.toLowerCase().includes(plate.trim().toLowerCase())
      );
    }

    if (user.trim()) {
      filtered = filtered.filter(
        (log) => log.user?.username === user
      );
    }

    setFilteredLogs(filtered);
  }, [logs, start, end, plate, user]);

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleClear = () => {
    setStart("");
    setEnd("");
    setPlate("");
    setUser("");
  };

  const hasFilter = !!(start || end || plate.trim() || user.trim());

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-700">Carregando histórico...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Histórico de Acesso Total</h2>

        <div className="mb-8">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col gap-6 md:gap-0 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col md:mr-4">
              <span className="text-sm font-semibold text-gray-700 mb-2">Filtrar por data</span>
              <div className="flex gap-2">
                <input
                  type="datetime-local"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-40"
                />
                <span className="self-center text-gray-500">até</span>
                <input
                  type="datetime-local"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 w-40"
                />
              </div>
            </div>

            <div className="flex flex-col md:mx-4">
              <span className="text-sm font-semibold text-gray-700 mb-2">Filtrar por placa</span>
              <input
                type="text"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="Pesquisar placa"
                className="border border-gray-300 rounded px-3 py-2 w-44"
              />
            </div>

            <div className="flex flex-col md:mx-4">
              <span className="text-sm font-semibold text-gray-700 mb-2">Filtrar por usuário</span>
              <select
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-44"
              >
                <option value="">Todos</option>
                {userOptions.map((username) => (
                  <option key={username} value={username}>
                    {username}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {hasFilter && (
            <div className="flex justify-end mt-4">
              <button
                onClick={handleClear}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold px-4 py-2 rounded flex items-center"
              >
                <FaTimes className="mr-2" /> Limpar pesquisa
              </button>
            </div>
          )}
        </div>

        {filteredLogs.length === 0 ? (
          <p className="text-gray-600">Nenhum registro encontrado.</p>
        ) : (
          <ul className="space-y-4">
            {filteredLogs.map((log) => (
              <li
                key={log.id}
                className="bg-gray-50 p-4 rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    Placa: {log.plate}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Usuário: {log.user?.username || "-"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Data: {new Date(log.timestamp).toLocaleString()}
                  </p>
                  {log.imageLink && (
                    <a
                      href={log.imageLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-sm"
                    >
                      Abrir imagem
                    </a>
                  )}
                </div>
                {log.imageLink && (
                  <div className="mt-3 md:mt-0 md:ml-6 flex-shrink-0">
                    <img
                      src={log.imageLink}
                      alt="Registro de acesso"
                      className="w-24 h-24 object-cover rounded border"
                    />
                  </div>
                )}
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

export default TotalAccessHistoryPage;