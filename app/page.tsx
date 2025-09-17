'use client';

import { useState, useEffect, useCallback } from 'react';
import { Radio, Waves } from 'lucide-react';
import RegistroForm from './components/RegistroForm';
import BusquedaForm from './components/BusquedaForm';
import TablaRegistros from './components/TablaRegistros';
import RelojTiempo from './components/RelojTiempo';
import Login from './components/Login';
import Header from './components/Header';
import { useAuth } from './contexts/AuthContext';

interface RadioData {
  orden: number;
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

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<RadioData[]>([]); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [filteredData, setFilteredData] = useState<RadioData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSearch, setCurrentSearch] = useState('');

  const fetchData = useCallback(async (searchTerm: string = '') => {
    // Solo ejecutar si está autenticado
    if (!isAuthenticated) {
      return;
    }

    setIsLoading(true);
    try {
      const url = searchTerm 
        ? `/api/radio?search=${encodeURIComponent(searchTerm)}`
        : '/api/radio';
      
      // Agregar token de autenticación
      const authToken = localStorage.getItem('radio-auth-token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      } else {
        console.error('No se encontró token de autenticación');
        return;
      }
      
      const response = await fetch(url, { headers });
      
      if (response.ok) {
        const result = await response.json();
        setData(result);
        setFilteredData(result);
      } else if (response.status === 401) {
        console.error('No autorizado - redirigiendo al login');
        // El usuario no está autorizado, limpiar sesión
        localStorage.removeItem('radio-auth');
        localStorage.removeItem('radio-user');
        localStorage.removeItem('radio-auth-token');
        window.location.reload();
      } else {
        console.error(`Error fetching data: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error de red:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Cargar datos iniciales solo cuando esté autenticado
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  const handleSearch = (searchTerm: string) => {
    setCurrentSearch(searchTerm);
    fetchData(searchTerm);
  };

  const handleRecordSaved = () => {
    // Recargar datos después de guardar un nuevo registro
    fetchData(currentSearch);
  };

  const handleDataChange = () => {
    // Recargar datos después de eliminar un registro
    fetchData(currentSearch);
  };

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con logout */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Reloj de Tiempo */}
          <section>
            <RelojTiempo />
          </section>

          {/* Formulario de Registro */}
          <section>
            <RegistroForm onRecordSaved={handleRecordSaved} />
          </section>

          {/* Formulario de Búsqueda */}
          <section>
            <BusquedaForm onSearch={handleSearch} isLoading={isLoading} data={filteredData} />
          </section>

          {/* Tabla de Registros */}
          <section>
            <TablaRegistros 
              data={filteredData} 
              onDataChange={handleDataChange}
              isLoading={isLoading}
            />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p className="flex items-center justify-center gap-2">
              <Radio className="w-4 h-4" />
              Sistema de Registros de Radio - Desarrollado por PurpuraDevelopment
              <Waves className="w-4 h-4" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
