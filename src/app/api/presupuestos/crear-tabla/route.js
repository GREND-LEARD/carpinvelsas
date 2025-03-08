import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';
import { verifyToken } from '@/app/utils/jwt';

export async function POST(request) {
    try {
        console.log('API - Recibida solicitud para crear tabla de presupuestos');
        
        // Verificar autenticación y permisos
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.split(' ')[1];
        
        if (!token) {
            return NextResponse.json(
                { message: 'No se proporcionó token de autenticación' },
                { status: 401 }
            );
        }
        
        let decoded;
        try {
            decoded = await verifyToken(token);
        } catch (tokenError) {
            return NextResponse.json(
                { message: 'Token inválido o expirado' },
                { status: 401 }
            );
        }
        
        if (!decoded || !decoded.id) {
            return NextResponse.json(
                { message: 'Token inválido o malformado' },
                { status: 401 }
            );
        }
        
        // Verificar si es administrador
        const { data: usuario, error: userError } = await supabase
            .from('usuarios')
            .select('rol')
            .eq('id', decoded.id)
            .single();
            
        if (userError) {
            return NextResponse.json(
                { message: 'Error al verificar permisos de usuario', error: userError.message },
                { status: 500 }
            );
        }
        
        if (!usuario) {
            return NextResponse.json(
                { message: 'Usuario no encontrado' },
                { status: 404 }
            );
        }
        
        if (usuario.rol !== 'admin') {
            return NextResponse.json(
                { message: 'Acceso denegado. Se requieren permisos de administrador' },
                { status: 403 }
            );
        }
        
        // Intentar crear la tabla usando SQL directo
        const { error: createTableError } = await supabase.rpc('crear_tabla_presupuestos');
        
        if (createTableError) {
            console.error('Error al crear tabla de presupuestos:', createTableError);
            
            // Si el error es por función no encontrada, guiar al usuario
            if (createTableError.message && createTableError.message.includes('function "crear_tabla_presupuestos" does not exist')) {
                return NextResponse.json({
                    message: 'Se necesita crear la función SQL para crear la tabla de presupuestos',
                    error: createTableError.message,
                    solution: `Debes crear una función SQL en Supabase llamada "crear_tabla_presupuestos". Puedes hacerlo desde el panel de SQL de Supabase con el siguiente código:
                    
CREATE OR REPLACE FUNCTION crear_tabla_presupuestos()
RETURNS void AS $$
BEGIN
    -- Crear tabla de presupuestos si no existe
    CREATE TABLE IF NOT EXISTS presupuestos (
        id SERIAL PRIMARY KEY,
        usuario_id UUID REFERENCES usuarios(id),
        nombre TEXT NOT NULL,
        categoria TEXT NOT NULL,
        descripcion TEXT,
        material TEXT NOT NULL,
        acabado TEXT NOT NULL,
        dimensiones JSONB,
        unidades INTEGER NOT NULL DEFAULT 1,
        comentarios TEXT,
        imagenes TEXT[],
        presupuesto JSONB,
        estado TEXT NOT NULL DEFAULT 'pendiente',
        fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT now(),
        fecha_actualizacion TIMESTAMP WITH TIME ZONE
    );
    
    -- Crear políticas RLS
    ALTER TABLE presupuestos ENABLE ROW LEVEL SECURITY;
    
    -- Política para que los usuarios vean solo sus presupuestos
    DROP POLICY IF EXISTS "Los usuarios pueden ver sus propios presupuestos" ON presupuestos;
    CREATE POLICY "Los usuarios pueden ver sus propios presupuestos" 
        ON presupuestos FOR SELECT 
        USING (auth.uid() = usuario_id);
    
    -- Política para que los administradores vean todos los presupuestos
    DROP POLICY IF EXISTS "Los administradores pueden ver todos los presupuestos" ON presupuestos;
    CREATE POLICY "Los administradores pueden ver todos los presupuestos" 
        ON presupuestos FOR SELECT 
        USING (
            EXISTS (
                SELECT 1 FROM usuarios
                WHERE usuarios.id = auth.uid() AND usuarios.rol = 'admin'
            )
        );
    
    -- Política para que los usuarios puedan crear sus propios presupuestos
    DROP POLICY IF EXISTS "Los usuarios pueden crear sus propios presupuestos" ON presupuestos;
    CREATE POLICY "Los usuarios pueden crear sus propios presupuestos" 
        ON presupuestos FOR INSERT 
        WITH CHECK (auth.uid() = usuario_id);
    
    -- Política para que los administradores puedan actualizar cualquier presupuesto
    DROP POLICY IF EXISTS "Los administradores pueden actualizar cualquier presupuesto" ON presupuestos;
    CREATE POLICY "Los administradores pueden actualizar cualquier presupuesto" 
        ON presupuestos FOR UPDATE
        USING (
            EXISTS (
                SELECT 1 FROM usuarios
                WHERE usuarios.id = auth.uid() AND usuarios.rol = 'admin'
            )
        );
END;
$$ LANGUAGE plpgsql;`
                }, { status: 500 });
            }
            
            return NextResponse.json({
                message: 'Error al crear la tabla de presupuestos',
                error: createTableError.message
            }, { status: 500 });
        }
        
        return NextResponse.json({
            message: 'Tabla de presupuestos creada exitosamente'
        });
        
    } catch (error) {
        console.error('Error general al crear tabla:', error);
        return NextResponse.json({
            message: 'Error interno del servidor',
            error: error.message
        }, { status: 500 });
    }
} 