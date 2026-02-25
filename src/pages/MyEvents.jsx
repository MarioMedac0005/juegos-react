import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventsThunk, leaveEvent } from '../store/eventsSlice';
import { MapPin, CalendarX2, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function MyEvents() {
  const dispatch = useDispatch();
  const { items: allEvents, joinedIds, loading } = useSelector((s) => s.events);

  useEffect(() => {
    // Ensure events are loaded (in case the user navigates directly here)
    if (allEvents.length === 0) dispatch(fetchEventsThunk());
  }, [dispatch, allEvents.length]);

  const myEvents = allEvents.filter((e) => joinedIds.includes(e.id));

  const handleLeave = (event) => {
    dispatch(leaveEvent(event.id));
    toast.success(`Has cancelado tu participación en "${event.title}"`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Mis Eventos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-80 bg-card rounded-xl animate-pulse border border-border" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col items-center gap-4 mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
          <Ticket className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Mis Eventos</h1>
        <p className="text-muted-foreground max-w-2xl">
          Los eventos gaming a los que te has apuntado.
        </p>
      </div>

      {myEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myEvents.map((event) => (
            <div
              key={event.id}
              className="group bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  ✓ Apuntado
                </div>
              </div>
              <div className="p-5 space-y-3">
                <h2 className="text-lg font-bold leading-tight">{event.title}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 flex-shrink-0 text-primary" />
                  <span>{event.location}</span>
                </div>
                <button
                  onClick={() => handleLeave(event)}
                  className="w-full mt-2 py-2.5 rounded-lg text-sm font-semibold border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
                >
                  Cancelar participación
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-80">
          <div className="bg-secondary/50 p-6 rounded-full mb-6">
            <CalendarX2 className="w-16 h-16 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No te has apuntado a ningún evento</h2>
          <p className="text-muted-foreground max-w-md mb-8">
            Explora los próximos eventos gaming y únete a los que más te interesen.
          </p>
          <Link
            to="/eventos"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Ver Eventos
          </Link>
        </div>
      )}
    </div>
  );
}
