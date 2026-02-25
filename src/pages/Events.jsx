import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventsThunk, joinEvent, leaveEvent } from '../store/eventsSlice';
import { MapPin, Calendar, CheckCircle2, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Events() {
  const dispatch = useDispatch();
  const { items: events, joinedIds, loading, error } = useSelector((s) => s.events);

  useEffect(() => {
    dispatch(fetchEventsThunk());
  }, [dispatch]);

  const handleJoin = (event) => {
    dispatch(joinEvent(event.id));
    toast.success(`¡Te has apuntado a "${event.title}"!`);
  };

  const handleLeave = (event) => {
    dispatch(leaveEvent(event.id));
    toast.success(`Has cancelado tu participación en "${event.title}"`);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
          <Ticket className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Eventos Gaming</h1>
        <p className="text-muted-foreground max-w-2xl">
          Descubre los próximos eventos del mundo de los videojuegos y apúntate a los que más te interesen.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-card rounded-xl animate-pulse border border-border" />
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const isJoined = joinedIds.includes(event.id);
            return (
              <div
                key={event.id}
                className="group bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-300"
              >
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  {isJoined && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Apuntado
                    </div>
                  )}
                </div>

                {/* Event Info */}
                <div className="p-5 space-y-3">
                  <h2 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                    {event.title}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 flex-shrink-0 text-primary" />
                    <span>{event.location}</span>
                  </div>

                  {/* Action button */}
                  {isJoined ? (
                    <button
                      onClick={() => handleLeave(event)}
                      className="w-full mt-2 py-2.5 rounded-lg text-sm font-semibold border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
                    >
                      Cancelar participación
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoin(event)}
                      className="w-full mt-2 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
                    >
                      Apuntarse al evento
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
