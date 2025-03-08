import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';
import { verifyToken } from '@/app/utils/jwt';

// Manejador principal para la subida de presupuestos
export async function POST(request) {
    try {
        // 1. Verificar autenticación
        const token = request.headers.get('authorization')?.split(' ')[1];
        
        if (!token) {
            return NextResponse.json(
                { message: 'No se proporcionó token de autenticación' },
                { status: 401 }
            );
        }
        
        const decoded = await verifyToken(token);
        
        if (!decoded || !decoded.id) {
            return NextResponse.json(
                { message: 'Token inválido' },
                { status: 401 }
            );
        }
        
        // Obtener el usuario para validar que existe
        const { data: usuario, error: userError } = await supabase
            .from('usuarios')
            .select('id, nombre, email')
            .eq('id', decoded.id)
            .single();
        
        if (userError || !usuario) {
            console.error('Error al buscar usuario:', userError);
            return NextResponse.json(
                { message: 'Usuario no encontrado' },
                { status: 404 }
            );
        }
        
        // 2. Procesar FormData
        const formData = await request.formData();
        const datosJSON = formData.get('datos');
        
        if (!datosJSON) {
            return NextResponse.json(
                { message: 'No se proporcionaron datos de presupuesto' },
                { status: 400 }
            );
        }
        
        const datos = JSON.parse(datosJSON);
        
        // 3. Validaciones básicas
        if (!datos.nombre || !datos.categoria || !datos.material) {
            return NextResponse.json(
                { message: 'Faltan campos requeridos en el presupuesto' },
                { status: 400 }
            );
        }
        
        // 4. Procesar imágenes si existen
        const imagenes = [];
        for (let i = 0; i < 3; i++) {
            const archivo = formData.get(`archivo_${i}`);
            if (archivo && archivo instanceof Blob) {
                // Generar nombre único para el archivo
                const extension = archivo.name.split('.').pop();
                const nombreArchivo = `presupuesto_${Date.now()}_${i}.${extension}`;
                
                // Subir archivo a Supabase Storage
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('referencias')
                    .upload(`presupuestos/${usuario.id}/${nombreArchivo}`, archivo);
                
                if (uploadError) {
                    console.error('Error al subir imagen:', uploadError);
                } else {
                    // Obtener URL pública
                    const { data: { publicUrl } } = supabase.storage
                        .from('referencias')
                        .getPublicUrl(`presupuestos/${usuario.id}/${nombreArchivo}`);
                    
                    imagenes.push(publicUrl);
                }
            }
        }
        
        // 5. Guardar presupuesto en la base de datos
        const presupuestoData = {
            usuario_id: usuario.id,
            nombre: datos.nombre,
            categoria: datos.categoria,
            descripcion: datos.descripcion || '',
            material: datos.material,
            acabado: datos.acabado,
            dimensiones: {
                ancho: datos.ancho,
                alto: datos.alto,
                profundidad: datos.profundidad
            },
            unidades: datos.unidades,
            comentarios: datos.comentarios || '',
            imagenes: imagenes,
            presupuesto: {
                subtotal: datos.presupuesto.subtotal,
                descuento: datos.presupuesto.descuento,
                total: datos.presupuesto.total,
                tiempo_estimado: datos.presupuesto.tiempoEstimado
            },
            estado: 'pendiente',
            fecha_creacion: new Date().toISOString()
        };
        
        const { data: presupuesto, error: presupuestoError } = await supabase
            .from('presupuestos')
            .insert(presupuestoData)
            .select()
            .single();
        
        if (presupuestoError) {
            console.error('Error al guardar presupuesto:', presupuestoError);
            return NextResponse.json(
                { message: 'Error al guardar el presupuesto en la base de datos' },
                { status: 500 }
            );
        }
        
        // 6. Crear notificación para el usuario
        await supabase
            .from('notificaciones')
            .insert({
                usuario_id: usuario.id,
                tipo: 'presupuesto',
                titulo: 'Presupuesto Recibido',
                mensaje: `Hemos recibido tu solicitud de presupuesto para "${datos.nombre}". Te contactaremos pronto.`,
                leido: false,
                datos: { presupuesto_id: presupuesto.id },
                fecha_creacion: new Date().toISOString()
            });
        
        // 7. Enviar notificación a administradores
        // TODO: Implementar envío de email o notificación a administradores
        
        return NextResponse.json({
            message: 'Presupuesto creado exitosamente',
            presupuesto_id: presupuesto.id
        }, { status: 201 });
        
    } catch (error) {
        console.error('Error al procesar presupuesto:', error);
        return NextResponse.json(
            { message: 'Error interno del servidor' },
            { status: 500 }
        );
    }
} 