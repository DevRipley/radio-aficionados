'use client';

import React, { useState, useEffect } from 'react';
import { Radio, Waves } from 'lucide-react';
import { useSession } from 'next-auth/react';
import RegistroForm from './components/RegistroForm';
import BusquedaForm from './components/BusquedaForm';
import TablaRegistros from './components/TablaRegistros';
import RelojTiempo from './components/RelojTiempo';
import LoginNextAuth from './components/LoginNextAuth';
import HeaderNextAuth from './components/HeaderNextAuth';
import { useLocalStorage } from './hooks/useLocalStorage';

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
  const { data: allData, isLoading: storageLoading, addRecord, deleteRecord, searchRecords, exportData } = useLocalStorage();
  const [filteredData, setFilteredData] = useState<RadioData[]>([]);
  const [currentSearch, setCurrentSearch] = useState('');

  // Actualizar datos filtrados cuando cambian los datos o la búsqueda
  const updateFilteredData = (searchTerm: string = '') => {
    const results = searchRecords(searchTerm);
    setFilteredData(results);
  };

  const handleSearch = (searchTerm: string) => {
    setCurrentSearch(searchTerm);
    updateFilteredData(searchTerm);
  };

  const handleRecordSaved = () => {
    // Actualizar datos filtrados después de guardar
    updateFilteredData(currentSearch);
  };

  const handleDataChange = () => {
    // Actualizar datos filtrados después de eliminar
    updateFilteredData(currentSearch);
  };

  // Actualizar filtros cuando cambian los datos del storage
  useEffect(() => {
    updateFilteredData(currentSearch);
  }, [allData, currentSearch, searchRecords]);

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
            <RegistroForm onRecordSaved={handleRecordSaved} addRecord={addRecord} />
          </section>

          {/* Formulario de Búsqueda */}
          <section>
            <BusquedaForm onSearch={handleSearch} isLoading={storageLoading} data={filteredData} exportData={exportData} />
          </section>

          {/* Tabla de Registros */}
          <section>
            <TablaRegistros 
              data={filteredData} 
              onDataChange={handleDataChange}
              isLoading={storageLoading}
              deleteRecord={deleteRecord}
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
