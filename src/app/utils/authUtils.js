import { supabase } from '@/app/lib/supabaseClient';

/**
 * Obtiene un token de autenticación válido
 * @returns {Promise<{token: string|null, source: string|null, error: Error|null}>}
 */
export const getAuthToken = async () => {
    let token = null;
    let source = null;
    let error = null;
    
    try {
        // 1. Intentar obtener de Supabase primero (más confiable)
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.access_token) {
                token = session.access_token;
                source = 'supabase';
            }
        } catch (supabaseError) {
            console.warn('Error al obtener sesión de Supabase:', supabaseError);
            error = supabaseError;
        }
        
        // 2. Si no se pudo obtener de Supabase, intentar con localStorage
        if (!token) {
            // Buscar en diferentes posibles ubicaciones
            const localToken = localStorage.getItem('token') || 
                              localStorage.getItem('supabase.auth.token') ||
                              localStorage.getItem('authToken');
            
            if (localToken) {
                token = localToken;
                source = 'localStorage';
            }
        }
        
    } catch (e) {
        console.error('Error general al obtener token de autenticación:', e);
        error = e;
    }
    
    return { token, source, error };
};

/**
 * Envía una solicitud a la API con el token de autenticación
 * @param {string} url - URL de la API
 * @param {Object} options - Opciones de fetch
 * @returns {Promise<{data: any|null, response: Response|null, error: Error|null, status: number|null}>}
 */
export const authenticatedFetch = async (url, options = {}) => {
    const result = {
        data: null,
        response: null,
        error: null,
        status: null
    };
    
    try {
        // Obtener token
        const { token, source } = await getAuthToken();
        
        if (!token) {
            throw new Error('No se pudo obtener un token de autenticación');
        }
        
        // Configurar headers con el token
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };
        
        // Realizar la solicitud
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        result.response = response;
        result.status = response.status;
        
        // Procesar la respuesta
        if (response.ok) {
            try {
                result.data = await response.json();
            } catch (parseError) {
                result.error = new Error('Error al analizar respuesta JSON');
            }
        } else {
            const errorText = await response.text();
            result.error = new Error(`Error HTTP ${response.status}: ${errorText}`);
        }
        
    } catch (fetchError) {
        console.error('Error en authenticatedFetch:', fetchError);
        result.error = fetchError;
    }
    
    return result;
}; 