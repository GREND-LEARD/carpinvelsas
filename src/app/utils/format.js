/**
 * Funciones de formateo para valores en la aplicación
 */

/**
 * Formatea un valor numérico como moneda (EUR)
 * @param {number} value - Valor a formatear
 * @param {string} currency - Código de moneda (por defecto EUR)
 * @returns {string} Valor formateado como moneda
 */
export function formatCurrency(value, currency = 'EUR') {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency,
  }).format(value);
}

/**
 * Formatea una fecha en formato legible
 * @param {string|Date} date - Fecha a formatear (string ISO o instancia de Date)
 * @param {Object} options - Opciones de formateo
 * @returns {string} Fecha formateada
 */
export function formatDate(date, options = {}) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (!(dateObj instanceof Date) || isNaN(dateObj)) {
    return 'Fecha inválida';
  }
  
  const defaultOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat('es-ES', defaultOptions).format(dateObj);
}

/**
 * Formatea una fecha y hora en formato legible
 * @param {string|Date} datetime - Fecha y hora a formatear
 * @returns {string} Fecha y hora formateada
 */
export function formatDateTime(datetime) {
  return formatDate(datetime, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Trunca un texto a una longitud máxima
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Formatea un número con separadores de miles
 * @param {number} value - Número a formatear
 * @param {number} decimals - Cantidad de decimales a mostrar
 * @returns {string} Número formateado
 */
export function formatNumber(value, decimals = 0) {
  return new Intl.NumberFormat('es-ES', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  }).format(value);
}

/**
 * Convierte la primera letra de un string a mayúscula
 * @param {string} text - Texto a capitalizar
 * @returns {string} Texto con la primera letra en mayúscula
 */
export function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
} 