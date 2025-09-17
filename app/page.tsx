'use client';

import { useState, useEffect } from 'react';
import { Radio, Waves } from 'lucide-react';
import RegistroForm from './components/RegistroForm';
import BusquedaForm from './components/BusquedaForm';
import TablaRegistros from './components/TablaRegistros';
import RelojTiempo from './components/RelojTiempo';

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
  const [data, setData] = useState<RadioData[]>([]); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [filteredData, setFilteredData] = useState<RadioData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSearch, setCurrentSearch] = useState('');

  // Cargar datos iniciales
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (searchTerm: string = '') => {
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
        console.error('Error fetching data');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <Radio className="w-8 h-8 text-gray-700" />
              <Waves className="w-6 h-6 text-gray-600" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Sistema de Registros de Radio
              </h1>
              <p className="text-gray-600 mt-1">
                Gestión completa de contactos y actividades radioaficionados
              </p>
            </div>
          </div>
        </div>
      </header>

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
