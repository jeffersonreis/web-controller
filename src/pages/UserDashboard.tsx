import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaSignOutAlt, FaCar, FaPlus, FaHistory } from 'react-icons/fa';
import axios from 'axios';

function UserDashboard() {
  const navigate = useNavigate();
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('loggedInUsername');
    const storedRole = localStorage.getItem('userRole');

    if (!authToken || !storedUsername || !storedRole || storedRole !== 'user') {
      handleLogout();
      toast('Acesso negado ou sessão inválida.', { icon: '⚠️' });
    } else {
      setLoggedInUsername(storedUsername);
      setUserRole(storedRole);
      fetchUserCars(authToken);
    }
  }, [navigate]);

  const fetchUserCars = async (token: string) => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL + '/vehicles';
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCars(response.data);
    } catch {
      toast.error('Erro ao carregar carros.');
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUsername');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    toast.success('Logout realizado com sucesso!');
    navigate('/');
  };

  const handleAddCar = () => {
    navigate('/cars/new');
  };

  const handleEditCar = (carId: number) => {
    navigate(`/cars/edit/${carId}`);
  };

  const handleViewHistory = (carId: number) => {
    navigate(`/cars/${carId}/history`);
  };

  const handleViewFullHistory = () => {
    navigate('/cars/history');
  };

  if (!localStorage.getItem('authToken') || userRole !== 'user') {
    return null;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl text-center relative">
        <button
          onClick={handleLogout}
          className="absolute right-6 top-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Bem-vindo, {loggedInUsername}!
        </h2>
        <p className="text-gray-600 mb-8">Gerencie seus carros aqui.</p>

        <div className="mb-8">
          <div
            className="flex items-center bg-purple-50 border border-purple-200 rounded-lg p-4 cursor-pointer hover:bg-purple-100 transition mb-4"
            onClick={handleViewFullHistory}
          >
            <FaHistory className="text-purple-700 text-2xl mr-3" />
            <span className="text-purple-800 font-semibold text-lg">
              Ver histórico completo de acesso
            </span>
          </div>
        </div>

        <div className="text-left">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Seus Carros</h3>
          <div className="mb-6">
            <button
              onClick={handleAddCar}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <FaPlus className="mr-2" /> Adicionar Novo Carro
            </button>
          </div>
          {loading ? (
            <div className="text-gray-500">Carregando carros...</div>
          ) : cars.length === 0 ? (
            <p className="text-gray-600">Você ainda não possui carros cadastrados.</p>
          ) : (
            <ul className="space-y-4">
              {cars.map(car => (
                <li key={car.id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    {car.imageLinks && car.imageLinks.length > 0 ? (
                      <img
                        src={car.imageLinks[0]}
                        alt={car.name}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded bg-gray-200 flex items-center justify-center">
                        <FaCar className="text-gray-400 text-2xl" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-800">{car.name}</p>
                      <p className="text-gray-600 text-sm">Placa: {car.plate}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditCar(car.id)}
                      className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleViewHistory(car.id)}
                      className="bg-purple-500 hover:bg-purple-700 text-white text-sm py-1 px-3 rounded"
                    >
                      Histórico
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
