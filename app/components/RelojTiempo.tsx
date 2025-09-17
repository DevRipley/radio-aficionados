'use client';

import { useState, useEffect } from 'react';
import { Clock, Globe } from 'lucide-react';

export default function RelojTiempo() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, isUTC: boolean = false) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: isUTC ? 'UTC' : undefined
    };
    
    return date.toLocaleTimeString('es-ES', options);
  };

  const formatDate = (date: Date, isUTC: boolean = false) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: isUTC ? 'UTC' : undefined
    };
    
    return date.toLocaleDateString('es-ES', options);
  };

  const getTimezone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hora Local */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0">
            <Clock className="w-6 h-6 text-gray-700" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-600 mb-1">
              Hora Local ({getTimezone()})
            </div>
            <div className="text-2xl font-mono font-bold text-gray-900">
              {formatTime(currentTime, false)}
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(currentTime, false)}
            </div>
          </div>
        </div>

        {/* Hora UTC */}
        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
          <div className="flex-shrink-0">
            <Globe className="w-6 h-6 text-blue-700" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-blue-600 mb-1">
              Hora UTC (Universal)
            </div>
            <div className="text-2xl font-mono font-bold text-blue-900">
              {formatTime(currentTime, true)}
            </div>
            <div className="text-xs text-blue-500">
              {formatDate(currentTime, true)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Información adicional */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Actualización automática cada segundo</span>
          <span>Zona horaria detectada: {getTimezone()}</span>
        </div>
      </div>
    </div>
  );
}
