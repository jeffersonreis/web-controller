// src/pages/CarEditForm.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaCar, FaArrowLeft, FaSave, FaTrash, FaImage } from 'react-icons/fa';

function CarEditForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState('');
  const [plate, setPlate] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [plateTouched, setPlateTouched] = useState(false);

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_BASE_URL + '/vehicles/' + id;
      const { data } = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setName(data.name || '');
      setPlate(formatFetchedPlate(data.plate || ''));
      if (data.imageLinks && data.imageLinks.length > 0) {
        setCurrentImage(data.imageLinks[data.imageLinks.length - 1]);
      }
    } catch {
      toast.error('Erro ao buscar carro.');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Mesma formatação do cadastro
  function formatClassicPlate(str: string) {
    if (str.length === 7) {
      return str.substring(0, 3) + '-' + str.substring(3);
    }
    return str;
  }
  // Quando buscar do backend, se for clássico (sem hífen), exibe formatado
  function formatFetchedPlate(str: string) {
    const upper = str.toUpperCase().replace('-', '');
    if (/^[A-Z]{3}[0-9]{4}$/.test(upper)) return formatClassicPlate(upper);
    return upper;
  }
  function isValidPlate(str: string) {
    const upper = str.toUpperCase().replace('-', '');
    const classic = /^[A-Z]{3}[0-9]{4}$/.test(upper);
    const mercosul = /^[A-Z]{3}[0-9]{1}[A-Z]{1}[0-9]{2}$/.test(upper);
    return classic || mercosul;
  }
  const classicPlate = /^[A-Z]{3}[0-9]{4}$/;

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length > 7) value = value.substring(0, 7);
    if (classicPlate.test(value)) value = formatClassicPlate(value);
    setPlate(value);
    setPlateTouched(true);
  };

  const getUnformattedPlate = () => plate.replace('-', '');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
    else setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !plate || !isValidPlate(getUnformattedPlate())) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_BASE_URL + '/vehicles/' + id;
      await axios.patch(apiUrl, {
        name,
        plate: getUnformattedPlate(),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (image) {
        const uploadUrl = apiUrl + '/upload-image';
        const formData = new FormData();
        formData.append('file', image);
        await axios.post(uploadUrl, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      toast.success('Carro atualizado!');
      navigate('/dashboard');
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Erro ao salvar.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este carro?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_BASE_URL + '/vehicles/' + id;
      await axios.delete(apiUrl, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Carro excluído!');
      navigate('/dashboard');
    } catch {
      toast.error('Erro ao excluir carro.');
    } finally {
      setLoading(false);
    }
  };

  const plateError =
    plateTouched && plate
      ? !isValidPlate(getUnformattedPlate())
        ? 'Placa fora do padrão'
        : ''
      : '';

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg text-center relative">
        <button
          onClick={() => navigate('/dashboard')}
          className="absolute left-6 top-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Voltar
        </button>
        <div className="flex items-center justify-center mb-6 mt-2">
          <FaCar className="text-4xl text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Editar Carro</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 items-stretch">
          <div className="flex flex-col text-left">
            <label className="font-semibold text-gray-700 mb-1">
              Nome/Modelo <span className="text-red-500">*</span>
            </label>
            <input
              className="border border-gray-300 rounded px-3 py-2"
              type="text"
              placeholder="Ex: Toyota Corolla"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="flex flex-col text-left">
            <label className="font-semibold text-gray-700 mb-1">
              Placa <span className="text-red-500">*</span>
            </label>
            <input
              className={`border rounded px-3 py-2 uppercase ${plateError ? 'border-red-400' : 'border-gray-300'}`}
              type="text"
              placeholder="ABC-1234 ou ABC1D23"
              value={plate}
              onChange={handlePlateChange}
              disabled={loading}
              maxLength={8}
              onBlur={() => setPlateTouched(true)}
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
            />
            {plateError && (
              <span className="text-red-500 text-sm mt-1">{plateError}</span>
            )}
          </div>
          <div className="flex flex-col text-left">
            <label className="font-semibold text-gray-700 mb-1">Imagem (opcional)</label>
            <label className="flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded px-3 py-3 cursor-pointer hover:bg-gray-200 transition mb-2">
              <FaImage className="mr-2 text-gray-500" />
              <span className="text-gray-700 font-medium">
                {image ? "Alterar imagem" : "Escolher imagem"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={loading}
              />
            </label>
            <div className="flex flex-col items-center mt-2">
              {image && previewUrl && (
                <>
                  <span className="text-sm text-gray-600 mb-2">{image.name}</span>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded border mb-1"
                  />
                </>
              )}
              {!image && currentImage && (
                <img
                  src={currentImage}
                  alt="Carro cadastrado"
                  className="w-40 h-40 object-cover rounded border mb-1"
                />
              )}
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
            disabled={loading || !isValidPlate(getUnformattedPlate())}
          >
            <FaSave className="mr-2" />
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
        <button
          onClick={handleDelete}
          className="w-full mt-6 bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
          disabled={loading}
        >
          <FaTrash className="mr-2" />
          Excluir carro
        </button>
      </div>
    </div>
  );
}

export default CarEditForm;
