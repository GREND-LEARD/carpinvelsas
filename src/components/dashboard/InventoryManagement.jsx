'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiAlertTriangle, FiFilter, FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi';

// Datos de ejemplo para el inventario
const initialInventory = [
  { 
    id: 1, 
    nombre: 'Madera de Roble', 
    categoria: 'Maderas', 
    unidad: 'metros cuadrados', 
    stock: 120, 
    stockMinimo: 50, 
    precio: 35.50, 
    proveedor: 'MaderasNaturales SL', 
    ultimaCompra: '2023-05-15' 
  },
  { 
    id: 2, 
    nombre: 'Madera de Nogal', 
    categoria: 'Maderas', 
    unidad: 'metros cuadrados', 
    stock: 30, 
    stockMinimo: 40, 
    precio: 45.75, 
    proveedor: 'MaderasNaturales SL', 
    ultimaCompra: '2023-06-10' 
  },
  { 
    id: 3, 
    nombre: 'Madera de Pino', 
    categoria: 'Maderas', 
    unidad: 'metros cuadrados', 
    stock: 250, 
    stockMinimo: 100, 
    precio: 22.25, 
    proveedor: 'Maderas Económicas', 
    ultimaCompra: '2023-07-05' 
  },
  { 
    id: 4, 
    nombre: 'Barniz Mate', 
    categoria: 'Acabados', 
    unidad: 'litros', 
    stock: 45, 
    stockMinimo: 20, 
    precio: 18.95, 
    proveedor: 'PinturasPro', 
    ultimaCompra: '2023-05-22' 
  },
  { 
    id: 5, 
    nombre: 'Barniz Brillante', 
    categoria: 'Acabados', 
    unidad: 'litros', 
    stock: 18, 
    stockMinimo: 20, 
    precio: 21.50, 
    proveedor: 'PinturasPro', 
    ultimaCompra: '2023-06-15' 
  },
  { 
    id: 6, 
    nombre: 'Bisagras Premium', 
    categoria: 'Herrajes', 
    unidad: 'unidades', 
    stock: 350, 
    stockMinimo: 100, 
    precio: 2.75, 
    proveedor: 'HerratesPro', 
    ultimaCompra: '2023-04-10' 
  },
  { 
    id: 7, 
    nombre: 'Tornillos 30mm', 
    categoria: 'Herrajes', 
    unidad: 'cajas', 
    stock: 25, 
    stockMinimo: 10, 
    precio: 8.50, 
    proveedor: 'HerratesPro', 
    ultimaCompra: '2023-07-01' 
  },
];

// Categorías para el filtro
const categorias = [
  'Todas',
  'Maderas',
  'Acabados',
  'Herrajes',
  'Herramientas',
  'Otros'
];

const InventoryManagement = () => {
  const [inventory, setInventory] = useState(initialInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // Filtrar el inventario basado en búsqueda y categoría
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.proveedor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || item.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Identificar elementos con stock bajo
  const hasLowStock = (item) => item.stock < item.stockMinimo;

  // Función para abrir el modal de edición
  const openEditModal = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  // Función para añadir nuevo item (simplificada para la demo)
  const handleAddItem = () => {
    setCurrentItem({
      id: inventory.length + 1,
      nombre: '',
      categoria: 'Maderas',
      unidad: '',
      stock: 0,
      stockMinimo: 0,
      precio: 0,
      proveedor: '',
      ultimaCompra: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-amber-50/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-amber-900">Gestión de Inventario</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddItem}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
        >
          <FiPlus /> Añadir Material
        </motion.button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3 text-amber-500" />
          <input 
            type="text" 
            placeholder="Buscar material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="relative">
          <FiFilter className="absolute left-3 top-3 text-amber-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-10 py-2 rounded-lg bg-white border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
          >
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Alerta de stock bajo */}
      {inventory.some(hasLowStock) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-amber-100 border-l-4 border-amber-500 p-4 rounded-r-lg mb-6"
        >
          <div className="flex items-center gap-3">
            <FiAlertTriangle className="text-amber-500 text-xl" />
            <p className="text-amber-800">
              <span className="font-bold">Alerta:</span> Hay materiales con stock por debajo del mínimo recomendado.
            </p>
          </div>
        </motion.div>
      )}

      {/* Tabla de inventario */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-amber-100">
            <tr>
              <th className="py-3 px-4 text-left text-amber-900 font-semibold">Material</th>
              <th className="py-3 px-4 text-left text-amber-900 font-semibold">Categoría</th>
              <th className="py-3 px-4 text-right text-amber-900 font-semibold">Stock</th>
              <th className="py-3 px-4 text-right text-amber-900 font-semibold">Precio</th>
              <th className="py-3 px-4 text-left text-amber-900 font-semibold">Proveedor</th>
              <th className="py-3 px-4 text-center text-amber-900 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item, index) => (
              <motion.tr 
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`border-b border-amber-100 ${hasLowStock(item) ? 'bg-red-50' : ''}`}
              >
                <td className="py-3 px-4 text-amber-900">{item.nombre}</td>
                <td className="py-3 px-4 text-amber-700">{item.categoria}</td>
                <td className={`py-3 px-4 text-right font-medium ${hasLowStock(item) ? 'text-red-600' : 'text-amber-700'}`}>
                  {item.stock} {item.unidad}
                  {hasLowStock(item) && (
                    <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                      ¡Bajo!
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right text-amber-700">
                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(item.precio)}
                </td>
                <td className="py-3 px-4 text-amber-700">{item.proveedor}</td>
                <td className="py-3 px-4">
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => openEditModal(item)}
                      className="p-1 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded-md"
                    >
                      <FiEdit />
                    </button>
                    <button 
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-md"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Estadísticas de inventario */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <p className="text-amber-600 text-sm">Total de Materiales</p>
          <p className="text-3xl font-bold text-amber-900">{inventory.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md">
          <p className="text-amber-600 text-sm">Valor del Inventario</p>
          <p className="text-3xl font-bold text-amber-900">
            {new Intl.NumberFormat('es-ES', { 
              style: 'currency', 
              currency: 'EUR',
              maximumFractionDigits: 0
            }).format(inventory.reduce((acc, item) => acc + (item.stock * item.precio), 0))}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md">
          <p className="text-amber-600 text-sm">Materiales con Stock Bajo</p>
          <p className="text-3xl font-bold text-red-500">{inventory.filter(hasLowStock).length}</p>
        </div>
      </div>

      {/* Modal para añadir/editar (simplificado) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 w-1/2 max-w-2xl"
          >
            <h3 className="text-xl font-bold text-amber-900 mb-6">
              {currentItem.id === inventory.length + 1 ? 'Añadir Material' : 'Editar Material'}
            </h3>
            <p className="text-amber-700 mb-4">Este es un formulario simplificado para la demo. En la implementación real, aquí irían todos los campos necesarios para gestionar el inventario.</p>
            <div className="flex justify-end gap-4 mt-8">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50"
              >
                Cancelar
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                Guardar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default InventoryManagement; 