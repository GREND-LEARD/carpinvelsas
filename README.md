# Carpinvelsas - Sistema de Gestión para Carpintería

## Descripción
Sistema profesional de gestión para empresas de carpintería, que incluye:
- Portal de clientes
- Gestión de presupuestos
- Gestión de proyectos
- Perfil y comunicación con clientes

## Tecnologías
- Next.js 14 (App Router)
- Tailwind CSS
- Supabase (Autenticación y Base de datos)
- JWT para tokens de sesión

## Estructura del Proyecto

```
carpinvelsas/
├── public/             # Archivos estáticos públicos
├── src/
│   ├── app/            # Estructura principal de la aplicación Next.js
│   │   ├── api/        # Endpoints de API
│   │   │   ├── admin/  # APIs administrativas
│   │   │   ├── auth/   # APIs de autenticación
│   │   │   └── ...     # Otros endpoints
│   │   ├── dashboard/  # Panel de administración
│   │   ├── client-portal/ # Portal para clientes
│   │   ├── lib/        # Utilidades y clientes (Supabase)
│   │   ├── utils/      # Funciones auxiliares (JWT, fechas, etc.)
│   │   └── ...         # Otras páginas y rutas
│   ├── components/     # Componentes reutilizables
│   │   ├── layout/     # Componentes de diseño
│   │   ├── ui/         # Componentes de interfaz
│   │   └── forms/      # Componentes de formularios
└── ...                 # Archivos de configuración
```

## Características Principales

- **Autenticación**: Sistema completo con registro, inicio de sesión y gestión de sesiones
- **Portal de Clientes**: Interfaz para que los clientes vean sus proyectos y presupuestos
- **Panel de Administración**: Control total de presupuestos, proyectos y comunicaciones
- **Gestión de Presupuestos**: Creación, seguimiento y comunicación con clientes
- **Mensajería**: Sistema integrado de mensajes entre administradores y clientes

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/carpinvelsas.git
cd carpinvelsas
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
- Crea un archivo `.env.local` basándote en `.env.example`
- Añade tus credenciales de Supabase

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## Estructura de la Base de Datos

- **usuarios**: Información de usuarios y autenticación
- **presupuestos**: Solicitudes y estados de presupuestos
- **proyectos**: Proyectos en curso y completados
- **mensajes**: Sistema de comunicación interna

## Convenciones de Código

- **Nomenclatura**: camelCase para variables/funciones, PascalCase para componentes
- **Componentes**: Usar componentes funcionales con hooks
- **Estado**: Utilizar Context API para estado global cuando sea necesario
- **API Routes**: Funciones específicas en `/api` con nombres descriptivos

## Contribución

1. Crea una nueva rama para tu característica
2. Realiza tus cambios siguiendo las convenciones establecidas
3. Asegúrate de que los tests pasen
4. Envía un Pull Request con una descripción detallada

## Licencia

Este proyecto está licenciado bajo [tu licencia aquí]
