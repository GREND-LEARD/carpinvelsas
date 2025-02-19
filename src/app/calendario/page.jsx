'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { supabase } from '@/app/lib/supabaseClient';

const CalendarPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '' });

  // Redireccionar a login si no hay usuario autenticado
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Cargar eventos desde Supabase para el usuario autenticado
  useEffect(() => {
    if (user) {
      const fetchEvents = async () => {
        const { data, error } = await supabase
          .from('eventos')
          .select('*')
          .eq('user_id', user.id);
        if (!error) {
          setEvents(
            data.map(event => ({
              id: event.id,
              title: event.title,
              start: event.start,
              end: event.end,
            }))
          );
        }
      };
      fetchEvents();
    }
  }, [user]);

  if (!user) return null;

  const handleDateSelect = (selectInfo) => {
    setNewEvent({
      title: '',
      start: selectInfo.startStr,
      end: selectInfo.endStr,
    });
    setShowModal(true);
  };

  const handleAddEvent = async () => {
    if (!newEvent.title) {
      alert('Por favor, ingrese un título');
      return;
    }
    const eventToSave = { ...newEvent, user_id: user.id };
    const { data, error } = await supabase.from('eventos').insert([eventToSave]).select();
    if (!error && data.length > 0) {
      setEvents([...events, { ...eventToSave, id: data[0].id }]);
      setShowModal(false);
      setNewEvent({ title: '', start: '', end: '' });
    } else {
      alert('Error al guardar el evento');
    }
  };

  // Filtrar y ordenar eventos futuros para mostrar en el panel lateral
  const upcomingEvents = events
    .filter(event => new Date(event.start) > new Date())
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[url('/textura-madera.jpg')] bg-cover bg-fixed">
      <div className="min-h-screen backdrop-blur-xl bg-amber-900/30 flex flex-col">
        {/* Header */}
        <header className="p-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-amber-50 font-serif"
          >
            Agenda del Taller
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-amber-200 mt-2"
          >
            Administra tus eventos y organiza tu taller de manera eficiente.
          </motion.p>
        </header>

        {/* Contenido principal */}
        <div className="flex-1 px-8 py-4 flex flex-col md:flex-row gap-8">
          {/* Calendario */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 bg-amber-50/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-amber-900 font-serif">Calendario</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setNewEvent({ title: '', start: new Date().toISOString(), end: new Date().toISOString() });
                  setShowModal(true);
                }}
                className="bg-amber-700 text-amber-50 px-3 py-1 rounded-lg flex items-center gap-2"
              >
                + Nuevo Evento
              </motion.button>
            </div>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              selectable={true}
              select={handleDateSelect}
              editable={true}
              eventClick={(info) => alert(`Evento: ${info.event.title}`)}
              height="500px"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
            />
          </motion.div>

          {/* Panel lateral de próximos eventos */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-1/3 bg-amber-50/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl flex flex-col gap-4"
          >
            <h2 className="text-2xl font-bold text-amber-900 font-serif mb-2">Próximos Eventos</h2>
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map(event => (
                <motion.div
                  key={event.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-3 bg-white rounded-lg shadow-sm"
                >
                  <h3 className="font-semibold text-amber-800">{event.title}</h3>
                  <p className="text-sm text-amber-600">{new Date(event.start).toLocaleString()}</p>
                </motion.div>
              ))
            ) : (
              <p className="text-amber-600 text-sm">No hay eventos próximos.</p>
            )}
          </motion.div>
        </div>

        {/* Modal para crear un nuevo evento */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ y: 50, scale: 0.9 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 50, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-amber-50 p-6 rounded-xl w-96 shadow-2xl"
              >
                <h3 className="text-xl font-bold mb-4">Nuevo Evento</h3>
                <input
                  type="text"
                  placeholder="Título del evento"
                  className="w-full mb-4 p-2 rounded border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
                <label className="block mb-2 text-sm font-medium text-amber-800">Inicio:</label>
                <input
                  type="datetime-local"
                  className="w-full mb-4 p-2 rounded border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  value={newEvent.start ? newEvent.start.substring(0, 16) : ''}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, start: new Date(e.target.value).toISOString() })
                  }
                />
                <label className="block mb-2 text-sm font-medium text-amber-800">Fin:</label>
                <input
                  type="datetime-local"
                  className="w-full mb-4 p-2 rounded border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  value={newEvent.end ? newEvent.end.substring(0, 16) : ''}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, end: new Date(e.target.value).toISOString() })
                  }
                />
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 bg-amber-700 text-white py-2 rounded"
                    onClick={handleAddEvent}
                  >
                    Guardar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 bg-gray-200 py-2 rounded"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CalendarPage;
