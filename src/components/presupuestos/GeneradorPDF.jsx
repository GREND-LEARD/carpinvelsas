'use client';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiPrinter } from 'react-icons/fi';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Este componente genera un PDF a partir de un presupuesto

const GeneradorPDF = ({ presupuesto, cliente }) => {
  const presupuestoRef = useRef(null);
  const [generando, setGenerando] = useState(false);
  
  // Función para generar un PDF del presupuesto
  const generarPDF = async () => {
    if (!presupuestoRef.current) return;
    
    try {
      setGenerando(true);
      
      // Capturar el contenido como imagen
      const canvas = await html2canvas(presupuestoRef.current, {
        scale: 2, // Mayor calidad
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      // Crear el PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      
      // Añadir logo y detalles de la empresa
      pdf.setFontSize(20);
      pdf.text('Carpinvelsas', 20, 20);
      
      // Añadir la imagen del presupuesto
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Añadir pie de página
      pdf.setFontSize(10);
      pdf.text('Carpinvelsas - Presupuesto válido por 30 días', 20, pdfHeight - 10);
      
      // Guardar el PDF
      pdf.save(`presupuesto_carpinvelsas_${presupuesto?.id || Date.now()}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Hubo un error al generar el PDF. Por favor, inténtalo de nuevo.');
    } finally {
      setGenerando(false);
    }
  };
  
  // Función para imprimir el presupuesto
  const imprimir = () => {
    if (!presupuestoRef.current) return;
    
    try {
      const content = presupuestoRef.current;
      const ventanaImpresion = window.open('', '_blank');
      
      if (!ventanaImpresion) {
        alert('Tu navegador bloqueó la ventana emergente. Por favor, permite ventanas emergentes para imprimir.');
        return;
      }
      
      // Estilos para la impresión
      const estilos = `
        body { 
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #713f12;
        }
        .presupuesto { 
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        h2 { 
          color: #78350f; 
          margin-bottom: 10px;
        }
        h3, h4 { 
          color: #92400e; 
          margin-top: 20px;
          margin-bottom: 10px;
        }
        hr {
          border: none;
          border-top: 1px solid #d6b88e;
          margin: 15px 0;
        }
        .header, .footer {
          text-align: center;
          margin-bottom: 20px;
        }
        .total {
          font-weight: bold;
          font-size: 1.2em;
          margin-top: 20px;
        }
        .terminos {
          font-size: 0.9em;
          margin-top: 30px;
        }
        @media print {
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `;
      
      // Contenido de la página a imprimir
      ventanaImpresion.document.write(`
        <html>
          <head>
            <title>Presupuesto Carpinvelsas</title>
            <style>${estilos}</style>
          </head>
          <body>
            <div class="presupuesto">
              <div class="header">
                <h2>CARPINVELSAS - PRESUPUESTO</h2>
                <p>Ref: PRES-${presupuesto?.id || Date.now()}</p>
              </div>
              ${content.innerHTML}
              <div class="footer">
                <p>© ${new Date().getFullYear()} Carpinvelsas - Todos los derechos reservados</p>
              </div>
            </div>
          </body>
        </html>
      `);
      
      ventanaImpresion.document.close();
      
      // Esperar a que los estilos y las imágenes se carguen antes de imprimir
      setTimeout(() => {
        ventanaImpresion.focus();
        ventanaImpresion.print();
        // No cerramos la ventana automáticamente para permitir que el usuario vea la vista previa
      }, 1000);
    } catch (error) {
      console.error('Error al imprimir:', error);
      alert('Hubo un error al preparar la impresión. Por favor, inténtalo de nuevo.');
    }
  };
  
  if (!presupuesto) {
    return <p className="text-amber-700 italic">No hay datos de presupuesto disponibles.</p>;
  }
  
  return (
    <div className="space-y-6">
      {/* Vista previa del presupuesto */}
      <div 
        ref={presupuestoRef} 
        className={`bg-white p-8 rounded-xl shadow-md border border-amber-200 ${
          generando ? 'opacity-50' : ''
        }`}
      >
        {/* Encabezado */}
        <div className="mb-8 border-b border-amber-200 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-amber-900">PRESUPUESTO</h2>
              <p className="text-amber-700">Ref: PRES-{presupuesto.id || Date.now()}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-amber-900">Carpinvelsas</p>
              <p className="text-amber-700">Artesanos de la madera</p>
              <p className="text-amber-700">Tel: 123-456-7890</p>
              <p className="text-amber-700">info@carpinvelsas.com</p>
            </div>
          </div>
        </div>
        
        {/* Datos del cliente */}
        <div className="mb-8 grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-amber-800 mb-2">Cliente</h3>
            <p className="text-amber-700">{cliente?.nombre || 'Cliente'}</p>
            <p className="text-amber-700">{cliente?.email || 'cliente@ejemplo.com'}</p>
            <p className="text-amber-700">{cliente?.telefono || '(123) 456-7890'}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-amber-800 mb-2">Detalles</h3>
            <p className="text-amber-700">
              <span className="font-medium">Fecha:</span> {
                new Date().toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })
              }
            </p>
            <p className="text-amber-700">
              <span className="font-medium">Validez:</span> 30 días
            </p>
          </div>
        </div>
        
        {/* Detalles del producto */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-amber-800 mb-4">Producto Personalizado</h3>
          <div className="bg-amber-50 p-4 rounded-lg mb-4">
            <p className="font-medium text-amber-900 mb-2">{presupuesto.nombreProducto || 'Mesa de Comedor'}</p>
            <p className="text-amber-700 mb-4">{presupuesto.descripcion || 'Mesa de comedor personalizada en madera de roble con acabado natural.'}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-amber-700">
                  <span className="font-medium">Madera:</span> {presupuesto.madera || 'Roble'}
                </p>
                <p className="text-sm text-amber-700">
                  <span className="font-medium">Acabado:</span> {presupuesto.acabado || 'Natural'}
                </p>
                {presupuesto.forma && (
                  <p className="text-sm text-amber-700">
                    <span className="font-medium">Forma:</span> {presupuesto.forma}
                  </p>
                )}
              </div>
              <div>
                {presupuesto.dimensiones && (
                  <p className="text-sm text-amber-700">
                    <span className="font-medium">Dimensiones:</span> {presupuesto.dimensiones}
                  </p>
                )}
                {presupuesto.extras && presupuesto.extras.length > 0 && (
                  <p className="text-sm text-amber-700">
                    <span className="font-medium">Extras:</span> {presupuesto.extras.join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Resumen económico */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-amber-800 mb-4">Resumen Económico</h3>
          <div className="border-t border-b border-amber-200 py-4">
            <div className="flex justify-between py-2">
              <span className="text-amber-700">Precio base</span>
              <span className="text-amber-900">
                {new Intl.NumberFormat('es-ES', { 
                  style: 'currency', 
                  currency: 'EUR' 
                }).format(presupuesto.precioBase || 350)}
              </span>
            </div>
            {presupuesto.extras && presupuesto.extras.length > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-amber-700">Extras</span>
                <span className="text-amber-900">
                  {new Intl.NumberFormat('es-ES', { 
                    style: 'currency', 
                    currency: 'EUR' 
                  }).format(presupuesto.precioExtras || 120)}
                </span>
              </div>
            )}
            <div className="flex justify-between py-2">
              <span className="text-amber-700">IVA (21%)</span>
              <span className="text-amber-900">
                {new Intl.NumberFormat('es-ES', { 
                  style: 'currency', 
                  currency: 'EUR' 
                }).format(presupuesto.precioIVA || 98.7)}
              </span>
            </div>
          </div>
          <div className="flex justify-between pt-4">
            <span className="text-lg font-bold text-amber-800">TOTAL</span>
            <span className="text-xl font-bold text-amber-900">
              {new Intl.NumberFormat('es-ES', { 
                style: 'currency', 
                currency: 'EUR' 
              }).format(presupuesto.precioTotal || 568.7)}
            </span>
          </div>
        </div>
        
        {/* Términos y condiciones */}
        <div className="mt-12 text-sm text-amber-600">
          <h4 className="font-medium text-amber-800 mb-2">Términos y Condiciones:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Este presupuesto es válido por 30 días a partir de la fecha de emisión.</li>
            <li>Se requiere un depósito del 30% para iniciar la producción.</li>
            <li>El plazo de entrega estimado es de 4-6 semanas desde la confirmación del pedido.</li>
            <li>La instalación no está incluida en el precio, a menos que se especifique lo contrario.</li>
            <li>Todos los productos tienen una garantía de 2 años por defectos de fabricación.</li>
          </ul>
        </div>
      </div>
      
      {/* Botones de acción */}
      <div className="flex gap-4 justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generarPDF}
          disabled={generando}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${
            generando ? 'bg-amber-400 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700'
          }`}
        >
          <FiDownload className="w-5 h-5" />
          {generando ? 'Generando PDF...' : 'Descargar PDF'}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={imprimir}
          disabled={generando}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-lg text-white"
        >
          <FiPrinter className="w-5 h-5" />
          Imprimir
        </motion.button>
      </div>
    </div>
  );
};

export default GeneradorPDF; 