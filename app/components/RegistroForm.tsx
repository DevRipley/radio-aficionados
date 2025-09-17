'use client';

import { useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';

interface FormData {
  qrz: string;
  qra: string;
  banda: string;
  frecuencia: string;
  rst: string;
  hora: string;
  horaUtc: string;
  fecha: string;
  actividad: string;
}

interface RegistroFormProps {
  onRecordSaved: () => void;
}

export default function RegistroForm({ onRecordSaved }: RegistroFormProps) {
  const [formData, setFormData] = useState<FormData>({
    qrz: '',
    qra: '',
    banda: '',
    frecuencia: '',
    rst: '',
    hora: '',
    horaUtc: '',
    fecha: '',
    actividad: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Formateo especial para horaUtc
    if (name === 'horaUtc') {
      // Permitir solo números y dos puntos
      const cleanValue = value.replace(/[^\d:]/g, '');
      
      // Auto-formatear mientras se escribe
      let formattedValue = cleanValue;
      if (cleanValue.length === 2 && !cleanValue.includes(':')) {
        formattedValue = cleanValue + ':';
      }
      
      // Validar formato básico (no más de 5 caracteres)
      if (formattedValue.length <= 5) {
        setFormData(prev => ({
          ...prev,
          [name]: formattedValue
        }));
      }
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const limpiarFormulario = () => {
    setFormData({
      qrz: '',
      qra: '',
      banda: '',
      frecuencia: '',
      rst: '',
      hora: '',
      horaUtc: '',
      fecha: '',
      actividad: '',
    });
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/radio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({ type: 'success', text: 'Registro guardado exitosamente' });
        limpiarFormulario();
        onRecordSaved();
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Error al guardar el registro' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión' });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().split(' ')[0].substring(0, 5);
  };

  const getCurrentTimeUTC = () => {
    const now = new Date();
    // Obtener componentes UTC por separado para garantizar formato 24h
    const hours = now.getUTCHours();
    const minutes = now.getUTCMinutes();
    
    // Formatear con padding de ceros y asegurar 24h
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    return `${formattedHours}:${formattedMinutes}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Save className="w-6 h-6 text-gray-600" />
        Formulario de Registro
      </h2>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* QRZ */}
          <div>
            <label htmlFor="qrz" className="block text-sm font-medium text-gray-700 mb-2">
              QRZ
            </label>
            <input
              type="text"
              id="qrz"
              name="qrz"
              value={formData.qrz}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-gray-900 transition-all duration-200"
              placeholder="Ingrese QRZ"
              required
            />
          </div>

          {/* QRA */}
          <div>
            <label htmlFor="qra" className="block text-sm font-medium text-gray-700  mb-2">
              QRA
            </label>
            <input
              type="text"
              id="qra"
              name="qra"
              value={formData.qra}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-gray-900 transition-all duration-200"
              placeholder="Ingrese QRA"
              required
            />
          </div>

          {/* BANDA */}
          <div>
            <label htmlFor="banda" className="block text-sm font-medium text-gray-700  mb-2">
              BANDA
            </label>
            <select
              id="banda"
              name="banda"
              value={formData.banda}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-gray-900 transition-all duration-200"
              required
            >
              <option value="">Seleccione banda</option>
              <option value="160m">160m</option>
              <option value="80m">80m</option>
              <option value="40m">40m</option>
              <option value="30m">30m</option>
              <option value="20m">20m</option>
              <option value="17m">17m</option>
              <option value="15m">15m</option>
              <option value="12m">12m</option>
              <option value="10m">10m</option>
              <option value="6m">6m</option>
              <option value="2m">2m</option>
              <option value="70cm">70cm</option>
            </select>
          </div>

          {/* FRECUENCIA */}
          <div>
            <label htmlFor="frecuencia" className="block text-sm font-medium text-gray-700  mb-2">
              FRECUENCIA
            </label>
            <input
              type="text"
              id="frecuencia"
              name="frecuencia"
              value={formData.frecuencia}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-gray-900 transition-all duration-200"
              placeholder="Ej: 14.205 MHz"
              required
            />
          </div>

          {/* RST */}
          <div>
            <label htmlFor="rst" className="block text-sm font-medium text-gray-700  mb-2">
              RST
            </label>
            <input
              type="text"
              id="rst"
              name="rst"
              value={formData.rst}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-gray-900 transition-all duration-200"
              placeholder="Ej: 599, 5.9, 59"
              title="Reporte de señal (RST, RS, etc.)"
              required
            />
          </div>

          {/* HORA */}
          <div>
            <label htmlFor="hora" className="block text-sm font-medium text-gray-700  mb-2">
              HORA
            </label>
            <div className="flex gap-2">
              <input
                type="time"
                id="hora"
                name="hora"
                value={formData.hora}
                onChange={handleInputChange}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-gray-900 transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, hora: getCurrentTime() }))}
                className="px-3 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
                title="Usar hora local actual"
              >
                🕐
              </button>
            </div>
          </div>

          {/* HORA UTC */}
          <div>
            <label htmlFor="horaUtc" className="block text-sm font-medium text-gray-700 mb-2">
              HORA UTC (24h)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="horaUtc"
                name="horaUtc"
                value={formData.horaUtc}
                onChange={handleInputChange}
                placeholder="HH:MM (24h)"
                pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
                maxLength={5}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-gray-900 font-mono transition-all duration-200"
                title="Formato: HH:MM (24 horas, ej: 15:30)"
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, horaUtc: getCurrentTimeUTC() }))}
                className="px-3 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                title="Usar hora UTC actual (24h)"
              >
                🌍
              </button>
            </div>
          </div>

          {/* FECHA */}
          <div>
            <label htmlFor="fecha" className="block text-sm font-medium text-gray-700  mb-2">
              FECHA
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={formData.fecha}
                onChange={handleInputChange}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-gray-900 transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, fecha: getCurrentDate() }))}
                className="px-3 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
                title="Usar fecha actual"
              >
                📅
              </button>
            </div>
          </div>

          {/* ACTIVIDAD */}
          <div className="md:col-span-2 lg:col-span-3">
            <label htmlFor="actividad" className="block text-sm font-medium text-gray-700  mb-2">
              ACTIVIDAD
            </label>
            <textarea
              id="actividad"
              name="actividad"
              value={formData.actividad}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-gray-900 transition-all duration-200 resize-none"
              placeholder="Describe la actividad o detalles del contacto"
              required
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            <Save className="w-5 h-5" />
            {isLoading ? 'Guardando...' : 'Registrar'}
          </button>
          
          <button
            type="button"
            onClick={limpiarFormulario}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="w-5 h-5" />
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}
