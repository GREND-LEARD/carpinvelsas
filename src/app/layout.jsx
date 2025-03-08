import { Inter } from "next/font/google";
import "../app/styles/globals.css";
import { AuthProvider } from "@/app/context/AuthContext"; // ✅ AuthProvider importado correctamente
import ThemeProvider from '@/components/ThemeProvider';

// Configuración de la fuente Inter
const inter = Inter({ subsets: ["latin"] });

// Definición de metadata
export const metadata = {
    title: 'Carpinvelsas - Carpintería artesanal',
    description: 'Sistema de gestión para empresas de carpintería',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    themeColor: '#ffffff',
    colorScheme: 'light'
};

// Layout principal
export default function RootLayout({ children }) {
    return (
        <html lang="es" className="light" style={{ colorScheme: 'light' }}>
            <head>
                {/* Favicon y metadatos adicionales */}
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <meta name="color-scheme" content="light" />
                <meta name="theme-color" content="#ffffff" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="format-detection" content="telephone=no" />
            </head>
            <body className="bg-white text-gray-900 min-h-screen">
                <ThemeProvider>
                    {/* Proveedor de autenticación */}
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}