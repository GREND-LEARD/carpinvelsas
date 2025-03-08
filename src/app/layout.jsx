import "../app/styles/globals.css";
import { AuthProvider } from "@/app/context/AuthContext";

// Definición de metadata
export const metadata = {
    title: "CARPINVEL SAS - Carpintería de Alta Calidad",
    description: "Diseño y fabricación de muebles personalizados de alta calidad. Artesanía en madera que perdura por generaciones.",
    keywords: "carpintería, muebles personalizados, diseño en madera, muebles de calidad, carpintería artesanal",
    author: "CARPINVEL SAS",
    metadataBase: new URL("https://www.carpinvelsas.com"), // ✅ Añade tu dominio real aquí
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
        <html lang="es">
            <head>
                {/* Favicon y metadatos adicionales */}
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <link rel="manifest" href="/site.webmanifest" />
                
                {/* Meta tags para arreglar tema en móviles */}
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <meta name="theme-color" content="#ffffff" />
                <meta name="color-scheme" content="light" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                
                {/* Script para forzar tema claro en móviles */}
                <script dangerouslySetInnerHTML={{
                    __html: `
                        (function() {
                            // Solo para móviles
                            if (window.innerWidth < 768) {
                                // Forzar tema claro
                                document.documentElement.style.colorScheme = 'light';
                                
                                // En caso de que el usuario tenga tema oscuro
                                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                                    document.querySelector('meta[name="theme-color"]').setAttribute('content', '#ffffff');
                                }
                            }
                        })();
                    `
                }} />
            </head>
            <body className="bg-amber-50">
                {/* Proveedor de autenticación */}
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}