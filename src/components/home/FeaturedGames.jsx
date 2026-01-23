import { useState, useEffect } from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';
import GameCard from './GameCard';
import { fetchTrendingGames } from '../../services/rawg.service';

export default function FeaturedGames() {
  // Estado para juegos trending, error y loading
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTrendingGames = async () => {
      setLoading(true);  // empezamos a cargar
      try {
        const result = await fetchTrendingGames();  // llamamos al service
        if (result.success) {
          // limitamos a los primeros 4 para mantener el layout
          setFeatured(result.data.slice(0, 4));
        } else {
          setError(result.error);
        }
      } catch (err) {
        console.error("Error inesperado al cargar los juegos:", err);
        setError("Ocurrió un error inesperado al cargar los juegos.");
      } finally {
        setLoading(false); // siempre desactivamos el loading
      }
    };

    getTrendingGames();
  }, []);

  // Mostrar loading
  if (loading) {
    return (
      <section className="container mx-auto px-4 z-10 relative">
        <p>Cargando juegos...</p>
      </section>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <section className="container mx-auto px-4 z-10 relative">
        <p className="text-red-500 font-semibold">Error: {error}</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 z-10 relative">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Tendencias
        </h2>
        <a href="#" className="text-sm font-medium text-primary hover:underline flex items-center transition-all hover:translate-x-1">
          Ver todo <ArrowRight className="ml-1 h-4 w-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map((game) => (
          <GameCard 
            key={game.id}
            id={game.id}
            title={game.name} // nombre del juego
            rating={game.rating} // puntuación
            category={game.genres?.map(g => g.name).join(" / ")} // géneros como categoría
            image={game.background_image} // imagen real del juego
            color="from-purple-500 to-indigo-600" // o genera según rating
          />
        ))}
      </div>

    </section>
  );
}
