import { useState, useEffect } from 'react';

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

const STORAGE_KEY = 'radio-registros-data';

export function useLocalStorage() {
  const [data, setData] = useState<RadioData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setData(parsedData);
      }
    } catch (error) {
      console.error('Error cargando datos del localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función para guardar datos
  const saveData = (newData: RadioData[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setData(newData);
      return true;
    } catch (error) {
      console.error('Error guardando datos en localStorage:', error);
      return false;
    }
  };

  // Función para agregar un nuevo registro
  const addRecord = (record: Omit<RadioData, 'orden'>): RadioData => {
    const newOrden = data.length > 0 ? Math.max(...data.map(item => item.orden)) + 1 : 1;
    const newRecord: RadioData = {
      ...record,
      orden: newOrden,
    };
    
    const newData = [...data, newRecord];
    saveData(newData);
    
    return newRecord;
  };

  // Función para eliminar un registro
  const deleteRecord = (orden: number): boolean => {
    const filteredData = data.filter(item => item.orden !== orden);
    if (filteredData.length === data.length) {
      return false; // No se encontró el registro
    }
    
    saveData(filteredData);
    return true;
  };

  // Función para buscar registros
  const searchRecords = (searchTerm: string): RadioData[] => {
    if (!searchTerm) {
      return data;
    }
    
    return data.filter(item => 
      Object.values(item).some(value => 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  // Función para exportar datos
  const exportData = (): RadioData[] => {
    return data;
  };

  return {
    data,
    isLoading,
    addRecord,
    deleteRecord,
    searchRecords,
    exportData,
    saveData,
  };
}
