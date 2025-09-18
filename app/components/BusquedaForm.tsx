'use client';

import { useState } from 'react';
import { Search, X, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

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

interface BusquedaFormProps {
  onSearch: (searchTerm: string) => void;
  isLoading: boolean;
  data: RadioData[];
  exportData: () => RadioData[];
}

export default function BusquedaForm({ onSearch, isLoading, data, exportData }: BusquedaFormProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const exportToExcel = () => {
    const allData = exportData();
    if (allData.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    // Preparar los datos para Excel
    const excelData = allData.map(item => ({
      'ORDEN': item.orden,
      'QRZ': item.qrz,
      'QRA': item.qra,
      'BANDA': item.banda,
      'FRECUENCIA': item.frecuencia,
      'RST': item.rst,
      'HORA': item.hora,
      'HORA_UTC': item.horaUtc,
      'FECHA': item.fecha,
      'ACTIVIDAD': item.actividad
    }));

    // Crear workbook y worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Configurar el ancho de las columnas
    const colWidths = [
      { wch: 8 },  // ORDEN
      { wch: 12 }, // QRZ
      { wch: 15 }, // QRA
      { wch: 10 }, // BANDA
      { wch: 15 }, // FRECUENCIA
      { wch: 8 },  // RST
      { wch: 10 }, // HORA
      { wch: 12 }, // HORA_UTC
      { wch: 12 }, // FECHA
      { wch: 30 }  // ACTIVIDAD
    ];
    ws['!cols'] = colWidths;

    // Agregar worksheet al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Registros Radio');

    // Generar nombre de archivo con fecha actual
    const now = new Date();
    const fileName = `registros_radio_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.xlsx`;

    // Descargar archivo
    XLSX.writeFile(wb, fileName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Search className="w-6 h-6 text-gray-600" />
          Búsqueda de Registros
        </h2>
        
        {data.length > 0 && (
          <button
            onClick={exportToExcel}
            className="bg-black hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Download className="w-5 h-5" />
            Exportar a Excel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por QRZ, QRA, banda, frecuencia, actividad..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-gray-900 transition-all duration-200"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="bg-black hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl min-w-[120px]"
        >
          <Search className="w-5 h-5" />
          {isLoading ? 'Buscando...' : 'Buscar'}
        </button>
        
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <X className="w-5 h-5" />
            Limpiar
          </button>
        )}
      </form>
      
      {searchTerm && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-800">
            <strong>Buscando:</strong> &quot;{searchTerm}&quot; - {data.length} resultado{data.length !== 1 ? 's' : ''} encontrado{data.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}
