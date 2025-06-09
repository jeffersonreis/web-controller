// src/pages/UserAccessHistoryPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaArrowLeft, FaTimes } from "react-icons/fa";

function UserAccessHistoryPage() {
  const navigate = useNavigate();
  const { carId } = useParams<{ carId?: string }>();

  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState<any[]>([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(carId || null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const carsResp = await axios.get(
        import.meta.env.VITE_API_BASE_URL + "/vehicles",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCars(carsResp.data);

      const historyResp = await axios.get(
        import.meta.env.VITE_API_BASE_URL + "/access-history/my",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLogs(historyResp.data);

      if (carId && carsResp.data && carsResp.data.length > 0) {
        const found = carsResp.data.find((v: any) => String(v.id) === String(carId));
        if (found && found.plate) {
          setSelectedCarId(String(found.id));
        }
      }
    } catch (err) {
      toast.error("Erro ao carregar histórico.");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = logs;

    if (selectedCarId && cars.length > 0) {
      const selectedCar = cars.find((c: any) => String(c.id) === String(selectedCarId));
      if (selectedCar && selectedCar.plate) {
        filtered = filtered.filter((log) => log.plate === selectedCar.plate);
      }
    }

    if (start) {
      const startDate = new Date(start);
      filtered = filtered.filter((log) => new Date(log.timestamp) >= startDate);
    }

    if (end) {
      const endDate = new Date(end);
      filtered = filtered.filter((log) => new Date(log.timestamp) <= endDate);
    }

    setFilteredLogs(filtered);
  }, [logs, start, end, selectedCarId, cars]);

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleClearFilters = () => {
    setStart("");
    setEnd("");
    setSelectedCarId(null);
  };

  const handleSelectCar = (id: string) => {
    setSelectedCarId(id);
  };

  const handleShowAllCars = () => {
    setSelectedCarId(null);
  };

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
        <button
          onClick={handleBack}
          className="mb-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Voltar
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Histórico de Acesso {selectedCarId ? "do Carro" : "de Todos os Carros"}
        </h2>
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
              <span className="text-sm font-semibold text-gray-700 mb-2">Carro</span>
              <select
                value={selectedCarId || ""}
                onChange={(e) => {
                  if (e.target.value) {
                    handleSelectCar(e.target.value);
                  } else {
                    handleShowAllCars();
                  }
                }}
                className="border border-gray-300 rounded px-3 py-2 w-44"
              >
                <option value="">Todos os carros</option>
                {cars.map((car: any) => (
                  <option key={car.id} value={car.id}>
                    {car.name || ""} ({car.plate})
                  </option>
                ))}
              </select>
            </div>
          </div>
          {(start || end || selectedCarId) && (
            <div className="flex justify-end mt-4">
              <button
                onClick={handleClearFilters}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold px-4 py-2 rounded flex items-center"
              >
                <FaTimes className="mr-2" />
                Limpar pesquisa
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
      </div>
    </div>
  );
}

export default UserAccessHistoryPage;
