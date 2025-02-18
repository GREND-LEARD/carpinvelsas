import { Inter } from "next/font/google";
import "../app/styles/globals.css";
import { AuthProvider } from "@/app/context/AuthContext"; // ✅ AuthProvider importado correctamente

// Configuración de la fuente Inter
const inter = Inter({ subsets: ["latin"] });

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
            </head>
            <body className={`${inter.className} bg-amber-50`}>
                {/* Proveedor de autenticación */}
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}