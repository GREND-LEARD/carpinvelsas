/**
 * Funciones de validación para formularios y datos
 */

/**
 * Valida si una cadena es un email válido
 * @param {string} email - Email a validar
 * @returns {boolean} True si es un email válido
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida si una contraseña cumple con los requisitos mínimos de seguridad
 * - Al menos 8 caracteres
 * - Al menos una letra mayúscula
 * - Al menos una letra minúscula
 * - Al menos un número
 * 
 * @param {string} password - Contraseña a validar
 * @returns {Object} Objeto con el resultado y mensajes de error
 */
export function validatePassword(password) {
  const result = {
    valid: true,
    errors: []
  };

  if (!password || password.length < 8) {
    result.valid = false;
    result.errors.push('La contraseña debe tener al menos 8 caracteres');
  }

  if (!/[A-Z]/.test(password)) {
    result.valid = false;
    result.errors.push('La contraseña debe incluir al menos una letra mayúscula');
  }

  if (!/[a-z]/.test(password)) {
    result.valid = false;
    result.errors.push('La contraseña debe incluir al menos una letra minúscula');
  }

  if (!/[0-9]/.test(password)) {
    result.valid = false;
    result.errors.push('La contraseña debe incluir al menos un número');
  }

  return result;
}

/**
 * Valida si un número de teléfono es válido (formato español)
 * @param {string} phone - Número de teléfono a validar
 * @returns {boolean} True si es un teléfono válido
 */
export function isValidPhone(phone) {
  // Eliminar espacios y caracteres no numéricos
  const cleanedPhone = phone.replace(/\s+/g, '').replace(/[^\d]/g, '');
  
  // Validar teléfono español (9 dígitos, empezando por 6, 7, 8 o 9)
  const phoneRegex = /^[6789]\d{8}$/;
  return phoneRegex.test(cleanedPhone);
}

/**
 * Valida si un objeto tiene todas las propiedades requeridas
 * @param {Object} object - Objeto a validar
 * @param {Array<string>} requiredFields - Campos requeridos
 * @returns {Object} Objeto con el resultado y campos faltantes
 */
export function validateRequiredFields(object, requiredFields) {
  const missingFields = requiredFields.filter(field => {
    const value = object[field];
    return value === undefined || value === null || value === '';
  });

  return {
    valid: missingFields.length === 0,
    missingFields
  };
}

/**
 * Valida un NIF español
 * @param {string} nif - NIF a validar
 * @returns {boolean} True si es un NIF válido
 */
export function isValidNIF(nif) {
  const nifRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
  
  if (!nifRegex.test(nif)) {
    return false;
  }
  
  const letter = nif.charAt(8).toUpperCase();
  const number = nif.substring(0, 8);
  const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
  const index = number % 23;
  
  return letters.charAt(index) === letter;
}

/**
 * Valida un CIF español
 * @param {string} cif - CIF a validar
 * @returns {boolean} True si es un CIF válido
 */
export function isValidCIF(cif) {
  const cifRegex = /^[a-zA-Z][0-9]{7}[a-zA-Z0-9]$/;
  return cifRegex.test(cif);
} 