import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import GameCard from '../components/home/GameCard';
import { fetchTrendingGames } from '../services/rawg.service';

export default function Games() {
  const [searchTerm, setSearchTerm] = useState('');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar juegos desde la API
  const loadGames = async (query = '') => {
    setLoading(true);
    try {
      const result = await fetchTrendingGames(8, query);
      if (result.success) {
        setGames(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Error al obtener juegos:", err);
      setError("Ocurrió un error inesperado al cargar los juegos.");
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar juegos con debounce (incluyendo carga inicial)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadGames(searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col items-center gap-6 mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-center tracking-tight">Explorar Videojuegos</h1>
        <p className="text-muted-foreground text-center max-w-2xl">
          Encuentra tu próximo juego favorito entre nuestra extensa colección.
        </p>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      {loading ? (
        <p className="text-center text-lg text-muted-foreground">Cargando juegos...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.length > 0 ? (
            games.map((game) => (
              <GameCard
                key={game.id}
                id={game.id}
                title={game.name}
                rating={game.rating}
                category={game.genres?.map(g => g.name).join(" / ")}
                image={game.background_image}
                description={game.description_raw}
                color="from-purple-500 to-indigo-600"
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-xl text-muted-foreground">No se encontraron juegos que coincidan con tu búsqueda.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
