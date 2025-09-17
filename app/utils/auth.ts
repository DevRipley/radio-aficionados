// Función para verificar autenticación en el servidor
export function verifyAuth(request: Request): boolean {
  try {
    // En un entorno real, verificarías JWT o session cookies
    // Para este caso simple, verificamos el header de autorización
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return false;
    }

    // Formato esperado: "Bearer H14NLE:Radioaficionado" (en base64)
    if (!authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = atob(token);
      const [username, password] = decoded.split(':');
      
      return username === 'H14NLE' && password === 'Radioaficionado';
    } catch {
      return false;
    }
  } catch {
    return false;
  }
}

// Función para crear el token de autenticación
export function createAuthToken(username: string, password: string): string {
  return btoa(`${username}:${password}`);
}
