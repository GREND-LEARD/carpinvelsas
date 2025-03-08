import "../app/styles/globals.css";
import { AuthProvider } from "@/app/context/AuthContext";

// Definición de metadata
export const metadata = {
    title: "CARPINVEL SAS - Carpintería de Alta Calidad",
    description: "Diseño y fabricación de muebles personalizados de alta calidad. Artesanía en madera que perdura por generaciones.",
    keywords: "carpintería, muebles personalizados, diseño en madera, muebles de calidad, carpintería artesanal",
    author: "CARPINVEL SAS",
    metadataBase: new URL("https://www.carpinvelsas.com"), // ✅ Añade tu dominio real aquí
    colorScheme: 'light',
    themeColor: '#ffffff',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    openGraph: {
        title: "CARPINVEL SAS",
        description: "Artesanía en madera que perdura por generaciones",
        images: [
            {
                url: "/og-image.jpg", // ✅ Asegúrate de que esta imagen exista en la carpeta `public/`
                width: 1200,
                height: 630,
                alt: "CARPINVEL SAS",
            },
        ],
    },
};

// Layout principal
export default function RootLayout({ children }) {
    return (
        <html lang="es" style={{ colorScheme: 'light' }} className="light">
            <head>
                {/* Favicon y metadatos adicionales */}
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <link rel="manifest" href="/site.webmanifest" />
                
                {/* Meta tags para arreglar tema en móviles */}
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
                <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: dark)" />
                <meta name="color-scheme" content="light" />
                <meta name="format-detection" content="telephone=no" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                
                {/* Script para forzar tema claro en Vercel */}
                <script dangerouslySetInnerHTML={{
                    __html: `
                        (function() {
                            // Forzar tema claro
                            document.documentElement.classList.add('light');
                            document.documentElement.classList.remove('dark');
                            document.documentElement.style.colorScheme = 'light';
                            
                            // Eliminar cualquier clase que pueda aplicar tema oscuro
                            document.documentElement.classList.remove('dark-mode', 'dark-theme', 'darkmode', 'darktheme');
                            
                            // Aplicar estilos directamente
                            var style = document.createElement('style');
                            style.textContent = "html, body { background-color: #ffffff !important; color: #171717 !important; } * { color-scheme: light !important; }";
                            document.head.appendChild(style);
                            
                            // En caso de que el usuario tenga tema oscuro
                            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                                // Forzar meta tag
                                var metaThemeColor = document.querySelector('meta[name="theme-color"]');
                                if (metaThemeColor) {
                                    metaThemeColor.setAttribute('content', '#ffffff');
                                } else {
                                    var meta = document.createElement('meta');
                                    meta.name = 'theme-color';
                                    meta.content = '#ffffff';
                                    document.head.appendChild(meta);
                                }
                            }
                            
                            // Aplicar a intervalos para asegurarse
                            setInterval(function() {
                                document.documentElement.style.backgroundColor = '#ffffff';
                                document.body.style.backgroundColor = '#ffffff';
                                document.documentElement.style.colorScheme = 'light';
                            }, 500);
                        })();
                    `
                }} />
            </head>
            <body className="bg-amber-50" style={{ backgroundColor: '#f8f5e6' }}>
                {/* Proveedor de autenticación */}
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}