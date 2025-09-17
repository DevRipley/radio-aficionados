import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

const dataFilePath = path.join(process.cwd(), 'data', 'radio-data.json');

// Función para leer datos del archivo JSON
function readData(): RadioData[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, '[]');
      return [];
    }
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error leyendo datos:', error);
    return [];
  }
}

// Función para escribir datos al archivo JSON
function writeData(data: RadioData[]): void {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error escribiendo datos:', error);
  }
}

// GET - Obtener todos los datos
export async function GET(request: NextRequest) {
  try {
    const data = readData();
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    
    if (search) {
      const filteredData = data.filter(item => 
        Object.values(item).some(value => 
          value.toString().toLowerCase().includes(search.toLowerCase())
        )
      );
      return NextResponse.json(filteredData);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error obteniendo datos' },
      { status: 500 }
    );
  }
}

// POST - Agregar nuevo registro
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = readData();
    
    // Generar nuevo número de orden automáticamente
    const newOrden = data.length > 0 ? Math.max(...data.map(item => item.orden)) + 1 : 1;
    
    const newRecord: RadioData = {
      orden: newOrden,
      qrz: body.qrz,
      qra: body.qra,
      banda: body.banda,
      frecuencia: body.frecuencia,
      rst: body.rst,
      hora: body.hora,
      horaUtc: body.horaUtc,
      fecha: body.fecha,
      actividad: body.actividad,
    };
    
    data.push(newRecord);
    writeData(data);
    
    return NextResponse.json(
      { message: 'Registro guardado exitosamente', data: newRecord },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Error guardando registro' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar registro
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const orden = url.searchParams.get('orden');
    
    if (!orden) {
      return NextResponse.json(
        { error: 'Número de orden requerido' },
        { status: 400 }
      );
    }
    
    const data = readData();
    const filteredData = data.filter(item => item.orden !== parseInt(orden));
    
    if (data.length === filteredData.length) {
      return NextResponse.json(
        { error: 'Registro no encontrado' },
        { status: 404 }
      );
    }
    
    writeData(filteredData);
    
    return NextResponse.json(
      { message: 'Registro eliminado exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Error eliminando registro' },
      { status: 500 }
    );
  }
}
