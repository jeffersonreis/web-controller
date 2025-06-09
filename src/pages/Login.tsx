// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Por favor, preencha usuário e senha.');
      return;
    }

    console.log('Attempting login with:', { username, password });
    const apiUrl = import.meta.env.VITE_API_BASE_URL + '/auth/login';

    if (!apiUrl || apiUrl === '/auth/login') {
        toast.error('URL da API não configurada. Verifique seu arquivo .env');
        console.error('API URL is not configured in .env');
        return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);

        if (data.access_token && data.user) {
            localStorage.setItem('authToken', data.access_token);
            // Salva o username e a role do objeto user
            localStorage.setItem('loggedInUsername', data.user.username);
            localStorage.setItem('userRole', data.user.role);

            toast.success('Login realizado com sucesso!');
            navigate('/dashboard');
        } else {
             const errorMessage = data.message || 'Login successful but missing token or user data.';
             console.error('Login successful but missing token or user:', data);
             toast.error(errorMessage);
        }

      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Erro ao fazer login. Verifique suas credenciais.';
        console.error('Login failed:', errorData);
        toast.error(errorMessage);
      }

    } catch (error) {
      console.error('An error occurred during login:', error);
      toast.error('Ocorreu um erro ao tentar conectar com o servidor.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Entrar</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Usuário
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Senha
            </label>
            <div className="relative">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="cursor-pointer absolute inset-y-0 right-0 pr-3 flex mb-3 items-center text-lg leading-5 text-gray-600 hover:text-gray-900 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
