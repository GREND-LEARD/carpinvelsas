# Plan de Limpieza y Reorganización del Proyecto Carpinvelsas

## Archivos y Carpetas a Eliminar

### Carpetas de Diagnóstico (Temporales)
- `/src/app/diagnostico-presupuestos` - Página temporal para diagnóstico
- `/src/app/admin-fix` - Página temporal de corrección administrativa

### APIs de Diagnóstico (Temporales)
- `/src/app/api/diagnostico/crear-funcion-rpc`
- `/src/app/api/diagnostico/resolver-admin`
- `/src/app/api/debug` - Endpoints temporales de debug

### Carpetas y archivos duplicados/redundantes
- Verificar y eliminar componentes duplicados
- Eliminar versiones antiguas de páginas guardadas como backup

## Reorganización de Estructura

### Componentes
1. Organizar los componentes en categorías más específicas:
   - `ui` - Componentes de UI básicos (botones, tarjetas, etc.)
   - `forms` - Componentes de formularios
   - `layout` - Componentes de diseño (navegación, footer, etc.)
   - `dashboard` - Componentes específicos del panel de admin
   - `client` - Componentes específicos del portal de clientes

2. Implementar estructura de carpetas consistente para cada componente:
   ```
   ComponentName/
   ├── index.js     # Export principal
   ├── ComponentName.jsx    # Componente React
   └── ComponentName.css    # Estilos (si se usan módulos CSS)
   ```

### Organización de API
1. Agrupar endpoints por funcionalidad:
   - `api/auth` - Autenticación y gestión de usuarios
   - `api/presupuestos` - Todo lo relacionado con presupuestos
   - `api/mensajes` - Sistema de mensajería
   - `api/proyectos` - Gestión de proyectos
   - `api/admin` - Funciones específicas de administración
   - `api/client` - Funciones específicas para el portal de clientes

2. Estandarizar la estructura de cada endpoint:
   ```
   endpoint-name/
   └── route.js    # Manejador de la ruta
   ```

### Páginas y Rutas
1. Simplificar la estructura de páginas, manteniendo solo las necesarias:
   - `/` - Página principal
   - `/login` - Inicio de sesión
   - `/register` - Registro de usuario
   - `/dashboard` - Panel de administración
     - `/dashboard/presupuestos` - Gestión de presupuestos
     - `/dashboard/mensajes` - Sistema de mensajería
     - `/dashboard/proyectos` - Gestión de proyectos
   - `/client-portal` - Portal para clientes
     - `/client-portal/presupuestos` - Presupuestos del cliente
     - `/client-portal/mensajes` - Mensajes del cliente
   - `/contact` - Página de contacto
   - `/productos` - Catálogo de productos

2. Eliminar páginas redundantes o no utilizadas

### Utilidades y Helpers
1. Organizar funciones de utilidad en módulos específicos:
   - `utils/date.js` - Funciones para manejo de fechas
   - `utils/validation.js` - Validación de datos
   - `utils/format.js` - Formateo de texto y números
   - `utils/auth.js` - Funciones de autenticación

## Mejoras Generales de Código

1. Estandarizar nomenclatura:
   - Componentes: PascalCase (MyComponent)
   - Funciones y variables: camelCase (myFunction)
   - Constantes globales: UPPER_SNAKE_CASE (API_URL)

2. Implementar manejo de errores consistente:
   - Usar try/catch en funciones asíncronas
   - Proporcionar mensajes de error descriptivos
   - Registrar errores de forma centralizada

3. Optimizar rendimiento:
   - Implementar carga perezosa (lazy loading) para componentes grandes
   - Usar memoización para cálculos costosos
   - Optimizar renderizados innecesarios

4. Mejorar la accesibilidad:
   - Añadir atributos ARIA apropiados
   - Asegurar contraste de color adecuado
   - Implementar navegación por teclado

## Plan de Implementación

1. **Fase 1: Backup y Preparación**
   - Crear rama de desarrollo para cambios
   - Realizar copia de seguridad completa
   - Documentar la estructura actual para referencia

2. **Fase 2: Limpieza Inicial**
   - Eliminar archivos y carpetas temporales/diagnóstico
   - Eliminar código comentado y no utilizado
   - Eliminar dependencias no utilizadas

3. **Fase 3: Reorganización**
   - Reorganizar estructura de carpetas
   - Mover archivos a las ubicaciones correctas
   - Actualizar importaciones

4. **Fase 4: Estandarización**
   - Aplicar convenciones de nomenclatura
   - Estandarizar estructura de componentes
   - Implementar manejo de errores consistente

5. **Fase 5: Documentación**
   - Actualizar README
   - Documentar API
   - Crear guía de estilo y convenciones

6. **Fase 6: Pruebas**
   - Verificar que todo funcione correctamente
   - Corregir problemas encontrados
   - Optimizar rendimiento 