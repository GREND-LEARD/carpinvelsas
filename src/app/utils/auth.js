import { jwtVerify } from 'jose';

/**
 * Funciones para manejo de autenticación y permisos
 */

/**
 * Verifica si un token JWT es válido
 * @param {string} token - Token JWT a verificar
 * @returns {Promise<Object>} - Payload del token si es válido
 * @throws {Error} - Si el token no es válido o ha expirado
 */
export async function verifyToken(token) {
  try {
    // La clave secreta debe coincidir con la usada para firmar los tokens
    const secretKey = process.env.JWT_SECRET || 'your-secret-key';
    
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secretKey)
    );
    
    return payload;
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
}

/**
 * Verifica si un usuario tiene un rol específico
 * @param {Object} user - Objeto de usuario
 * @param {string|Array} role - Rol o roles permitidos
 * @returns {boolean} - True si el usuario tiene el rol requerido
 */
export function hasRole(user, role) {
  if (!user || !user.rol) return false;
  
  if (Array.isArray(role)) {
    return role.includes(user.rol);
  }
  
  return user.rol === role;
}

/**
 * Verifica si un token tiene los permisos necesarios
 * @param {string} token - Token JWT
 * @param {string|Array} requiredRole - Rol o roles requeridos
 * @returns {Promise<boolean>} - True si el token tiene los permisos necesarios
 */
export async function checkPermission(token, requiredRole) {
  try {
    const payload = await verifyToken(token);
    return hasRole(payload, requiredRole);
  } catch (error) {
    return false;
  }
}

/**
 * Obtiene el token del encabezado de autorización
 * @param {Object} headers - Encabezados de la solicitud
 * @returns {string|null} - Token si existe, null en caso contrario
 */
export function getTokenFromHeaders(headers) {
  const authHeader = headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7);
}

/**
 * Middleware para proteger rutas de API
 * @param {Function} handler - Manejador de la ruta
 * @param {Object} options - Opciones de configuración
 * @param {string|Array} options.roles - Roles permitidos
 * @returns {Function} - Manejador con protección
 */
export function withAuth(handler, options = {}) {
  return async (req, res) => {
    try {
      const token = getTokenFromHeaders(req.headers);
      
      if (!token) {
        return new Response(JSON.stringify({ error: 'No autorizado' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const payload = await verifyToken(token);
      
      // Verificar roles si se especifican
      if (options.roles && !hasRole(payload, options.roles)) {
        return new Response(JSON.stringify({ error: 'Acceso denegado' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Agregar información del usuario a la solicitud
      req.user = payload;
      
      return handler(req, res);
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };
} 