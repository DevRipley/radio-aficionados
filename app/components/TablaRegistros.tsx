'use client';

import React, { useState } from 'react';
import { Trash2, Eye, EyeOff } from 'lucide-react';

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

interface TablaRegistrosProps {
  data: RadioData[];
  onDataChange: () => void;
  isLoading: boolean;
}

export default function TablaRegistros({ data, onDataChange, isLoading }: TablaRegistrosProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRowExpansion = (orden: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(orden)) {
      newExpanded.delete(orden);
    } else {
      newExpanded.add(orden);
    }
    setExpandedRows(newExpanded);
  };


  const deleteRecord = async (orden: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      return;
    }

    try {
      const response = await fetch(`/api/radio?orden=${orden}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDataChange();
        alert('Registro eliminado exitosamente');
      } else {
        const error = await response.json();
        alert(error.error || 'Error al eliminar el registro');
      }
    } catch {
      alert('Error de conexión');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white  rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-lg text-gray-600">Cargando datos...</span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white  rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Eye className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No hay registros
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            No se encontraron registros que coincidan con los criterios de búsqueda.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">
          Registros Encontrados ({data.length})
        </h2>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orden
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                QRZ
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                QRA
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Banda
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Frecuencia
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                RST
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hora Local
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hora UTC
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <React.Fragment key={item.orden}>
                <tr className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{item.orden}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {item.qrz}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.qra}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.banda}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {item.frecuencia}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {item.rst}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {item.hora || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900 font-mono">
                    {item.horaUtc || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.fecha}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleRowExpansion(item.orden)}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
                        title={expandedRows.has(item.orden) ? 'Ocultar detalles' : 'Ver detalles'}
                      >
                        {expandedRows.has(item.orden) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteRecord(item.orden)}
                        className="text-red-600 hover:text-red-800 text-red-600 hover:text-red-800 transition-colors duration-150"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                
                {/* Fila expandida para mostrar actividad */}
                {expandedRows.has(item.orden) && (
                  <tr className="bg-gray-50">
                    <td colSpan={9} className="px-6 py-4">
                      <div className="bg-white rounded-lg p-4 border border-gray-200 ">
                        <h4 className="font-semibold text-gray-800 mb-2">Actividad:</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {item.actividad || 'Sin descripción de actividad'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer con estadísticas */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 ">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Total de registros: {data.length}</span>
          <span>
            Bandas únicas: {new Set(data.map(item => item.banda)).size}
          </span>
        </div>
      </div>
    </div>
  );
}
