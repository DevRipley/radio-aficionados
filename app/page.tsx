'use client';

import { useState, useEffect, useCallback } from 'react';
import { Radio, Waves } from 'lucide-react';
import { useSession } from 'next-auth/react';
import RegistroForm from './components/RegistroForm';
import BusquedaForm from './components/BusquedaForm';
import TablaRegistros from './components/TablaRegistros';
import RelojTiempo from './components/RelojTiempo';
import LoginNextAuth from './components/LoginNextAuth';
import HeaderNextAuth from './components/HeaderNextAuth';

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
  const { data: session, status } = useSession();
  const [data, setData] = useState<RadioData[]>([]); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [filteredData, setFilteredData] = useState<RadioData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSearch, setCurrentSearch] = useState('');

  const fetchData = useCallback(async (searchTerm: string = '') => {
    // Solo ejecutar si está autenticado
    if (!session) {
      return;
    }

    setIsLoading(true);
    try {
      const url = searchTerm 
        ? `/api/radio?search=${encodeURIComponent(searchTerm)}`
        : '/api/radio';
      
      const response = await fetch(url);
      
      if (response.ok) {
        const result = await response.json();
        setData(result);
        setFilteredData(result);
      } else {
        console.error(`Error fetching data: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error de red:', error);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  // Cargar datos iniciales solo cuando esté autenticado
  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session, fetchData]);

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

  // Mostrar loading mientras se inicializa NextAuth
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar login
  if (!session) {
    return <LoginNextAuth />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con logout */}
      <HeaderNextAuth />

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
