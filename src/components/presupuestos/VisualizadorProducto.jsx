'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Función para obtener color basado en el tipo de madera
const obtenerColorMadera = (maderaId) => {
  const coloresMadera = {
    'roble': '#D4BC8B',
    'pino': '#F0D5A8',
    'nogal': '#5E4B3B',
    'cerezo': '#A65E44',
    'haya': '#E8C09C'
  };
  
  return coloresMadera[maderaId] || '#D4BC8B';
};

// Función para ajustar el brillo del color según el acabado
const ajustarPorAcabado = (colorHex, acabadoId) => {
  // Convertir color hexadecimal a RGB
  const r = parseInt(colorHex.substring(1, 3), 16);
  const g = parseInt(colorHex.substring(3, 5), 16);
  const b = parseInt(colorHex.substring(5, 7), 16);
  
  // Ajustar según acabado
  switch (acabadoId) {
    case 'brillante':
      // Más brillo
      return `rgb(${Math.min(r + 20, 255)}, ${Math.min(g + 20, 255)}, ${Math.min(b + 20, 255)})`;
    case 'mate':
      // Más opaco
      return `rgb(${Math.max(r - 10, 0)}, ${Math.max(g - 10, 0)}, ${Math.max(b - 10, 0)})`;
    case 'satinado':
      // Ligero brillo
      return `rgb(${Math.min(r + 10, 255)}, ${Math.min(g + 10, 255)}, ${Math.min(b + 10, 255)})`;
    case 'teñido':
      // Más saturado y oscuro
      return `rgb(${Math.max(r - 20, 0)}, ${Math.max(g - 10, 0)}, ${Math.max(b, 0)})`;
    default:
      return colorHex;
  }
};

// Dibujar una mesa rectangular
const dibujarMesaRectangular = (ctx, ancho, largo, color) => {
  // Perspectiva simple
  const perspectiva = 0.7;
  
  // Tamaño de la superficie
  const superficieAncho = ancho * 0.8;
  const superficieLargo = largo * 0.8;
  
  // Centro del canvas
  const centroX = ctx.canvas.width / 2;
  const centroY = ctx.canvas.height / 2;
  
  // Superficie de la mesa (vista en perspectiva)
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(centroX - superficieAncho / 2, centroY - superficieLargo * perspectiva / 2);
  ctx.lineTo(centroX + superficieAncho / 2, centroY - superficieLargo * perspectiva / 2);
  ctx.lineTo(centroX + superficieAncho / 2, centroY + superficieLargo * perspectiva / 2);
  ctx.lineTo(centroX - superficieAncho / 2, centroY + superficieLargo * perspectiva / 2);
  ctx.closePath();
  ctx.fill();
  
  // Borde de la superficie
  ctx.strokeStyle = '#5D4037';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Patas de la mesa
  const pataAncho = 10;
  const pataAlto = 60;
  const pataOffsetX = superficieAncho / 2 - 15;
  const pataOffsetY = superficieLargo * perspectiva / 2 - 15;
  
  ctx.fillStyle = color;
  
  // Pata 1 (frente izquierda)
  ctx.fillRect(
    centroX - pataOffsetX - pataAncho / 2,
    centroY + pataOffsetY,
    pataAncho,
    pataAlto
  );
  
  // Pata 2 (frente derecha)
  ctx.fillRect(
    centroX + pataOffsetX - pataAncho / 2,
    centroY + pataOffsetY,
    pataAncho,
    pataAlto
  );
  
  // Pata 3 (atrás izquierda, ajustada por perspectiva)
  ctx.fillRect(
    centroX - pataOffsetX - pataAncho / 2,
    centroY - pataOffsetY - pataAncho,
    pataAncho,
    pataAncho + pataAlto * perspectiva
  );
  
  // Pata 4 (atrás derecha, ajustada por perspectiva)
  ctx.fillRect(
    centroX + pataOffsetX - pataAncho / 2,
    centroY - pataOffsetY - pataAncho,
    pataAncho,
    pataAncho + pataAlto * perspectiva
  );
  
  // Sombra
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.beginPath();
  ctx.ellipse(
    centroX,
    centroY + pataAlto + 10,
    superficieAncho / 2,
    superficieLargo * perspectiva / 3,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();
};

// Dibujar una mesa redonda
const dibujarMesaRedonda = (ctx, diametro, color) => {
  // Perspectiva
  const perspectiva = 0.3;
  
  // Centro del canvas
  const centroX = ctx.canvas.width / 2;
  const centroY = ctx.canvas.height / 2;
  
  // Radio
  const radio = diametro * 0.4;
  
  // Superficie de la mesa (oval para perspectiva)
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(
    centroX,
    centroY,
    radio,
    radio * (1 - perspectiva),
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();
  
  // Borde de la superficie
  ctx.strokeStyle = '#5D4037';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Pata central
  const pataAncho = radio * 0.2;
  const pataAlto = 60;
  
  // Base cónica
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(centroX - pataAncho, centroY + 10);
  ctx.lineTo(centroX + pataAncho, centroY + 10);
  ctx.lineTo(centroX + pataAncho / 2, centroY + pataAlto);
  ctx.lineTo(centroX - pataAncho / 2, centroY + pataAlto);
  ctx.closePath();
  ctx.fill();
  
  // Sombra
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.beginPath();
  ctx.ellipse(
    centroX,
    centroY + pataAlto + 5,
    radio / 2,
    radio / 3,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();
};

// Dibujar una silla simple
const dibujarSilla = (ctx, ancho, color) => {
  // Centro del canvas
  const centroX = ctx.canvas.width / 2;
  const centroY = ctx.canvas.height / 2;
  
  // Dimensiones
  const asientoAncho = ancho * 0.6;
  const asientoProfundidad = asientoAncho * 0.8;
  const respaldoAlto = asientoProfundidad * 0.8;
  const pataAlto = 50;

  // Perspectiva
  const perspectiva = 0.5;
  
  // Asiento
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(centroX - asientoAncho / 2, centroY);
  ctx.lineTo(centroX + asientoAncho / 2, centroY);
  ctx.lineTo(centroX + asientoAncho / 2, centroY + asientoProfundidad * perspectiva);
  ctx.lineTo(centroX - asientoAncho / 2, centroY + asientoProfundidad * perspectiva);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#5D4037';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Respaldo
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(centroX - asientoAncho / 2, centroY);
  ctx.lineTo(centroX + asientoAncho / 2, centroY);
  ctx.lineTo(centroX + asientoAncho / 2, centroY - respaldoAlto);
  ctx.lineTo(centroX - asientoAncho / 2, centroY - respaldoAlto);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Patas
  const pataAncho = 5;
  const pataOffsetX = asientoAncho / 2 - 10;
  const pataOffsetY = asientoProfundidad * perspectiva - 5;
  
  ctx.fillStyle = color;
  
  // Pata 1 (frente izquierda)
  ctx.fillRect(
    centroX - pataOffsetX - pataAncho / 2,
    centroY + pataOffsetY,
    pataAncho,
    pataAlto
  );
  
  // Pata 2 (frente derecha)
  ctx.fillRect(
    centroX + pataOffsetX - pataAncho / 2,
    centroY + pataOffsetY,
    pataAncho,
    pataAlto
  );
  
  // Sombra
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.beginPath();
  ctx.ellipse(
    centroX,
    centroY + pataAlto + 10,
    asientoAncho / 2.2,
    asientoProfundidad * perspectiva / 2.5,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();
};

// Componente principal
const VisualizadorProducto = ({ tipo, selecciones }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Obtener color basado en la madera y acabado seleccionados
    const colorBase = obtenerColorMadera(selecciones.madera);
    const colorFinal = ajustarPorAcabado(colorBase, selecciones.acabado);
    
    // Dibujar según el tipo de producto
    if (tipo === 'mesas') {
      if (selecciones.forma === 'redonda' || selecciones.forma === 'ovalada') {
        dibujarMesaRedonda(ctx, selecciones.personalizado ? selecciones.ancho : 150, colorFinal);
      } else {
        // Rectangular o cuadrada
        const ancho = selecciones.personalizado ? selecciones.ancho : 150;
        const largo = selecciones.personalizado ? selecciones.largo : 200;
        dibujarMesaRectangular(ctx, ancho, largo, colorFinal);
      }
    } else if (tipo === 'sillas') {
      dibujarSilla(ctx, 100, colorFinal);
    } else {
      // Representación genérica para otros tipos
      ctx.fillStyle = colorFinal;
      ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);
      ctx.strokeStyle = '#5D4037';
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
      
      // Texto informativo
      ctx.fillStyle = '#5D4037';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        tipo ? tipo.charAt(0).toUpperCase() + tipo.slice(1) : 'Producto',
        canvas.width / 2,
        canvas.height / 2
      );
    }
    
  }, [tipo, selecciones]);
  
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <canvas
          ref={canvasRef}
          width={300}
          height={200}
          className="border border-amber-200 rounded-lg"
        />
        <p className="absolute bottom-2 right-2 text-xs text-amber-500">Vista previa</p>
      </motion.div>
    </div>
  );
};

export default VisualizadorProducto; 