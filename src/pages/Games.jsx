import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import GameCard from '../components/home/GameCard';
import Pagination from '../components/Pagination';
import { fetchGames } from '../services/rawg.service';

const PAGE_SIZE = 12;

export default function Games() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';

  const [games, setGames] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    const loadGames = async () => {
      setLoading(true);
      try {
        const result = await fetchGames({ page, pageSize: PAGE_SIZE, search, ordering: '-added' });
        if (result.success) {
          setGames(result.data);
          setCount(result.count || 0);
          setError(null);
        } else {
          setError(result.error);
        }
      } catch (err) {
        console.error('Error al obtener juegos:', err);
        setError('Ocurrió un error inesperado al cargar los juegos.');
      } finally {
        setLoading(false);
      }
    };
    loadGames();
  }, [page, search]);

  // Debounce search input → update URL
  useEffect(() => {
    const id = setTimeout(() => {
      const newParams = {};
      if (searchInput) newParams.search = searchInput;
      newParams.page = '1'; // reset to page 1 on new search
      setSearchParams(newParams);
    }, 500);
    return () => clearTimeout(id);
  }, [searchInput]);

  const extraParams = {};
  if (search) extraParams.search = search;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col items-center gap-6 mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-center tracking-tight">Explorar Videojuegos</h1>
        <p className="text-muted-foreground text-center max-w-2xl">
          Encuentra tu próximo juego favorito entre nuestra extensa colección.
        </p>
        <SearchBar value={searchInput} onChange={setSearchInput} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(PAGE_SIZE)].map((_, i) => (
            <div key={i} className="h-72 bg-card rounded-xl animate-pulse border border-border" />
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.length > 0 ? (
              games.map((game) => (
                <GameCard
                  key={game.id}
                  id={game.id}
                  title={game.name}
                  rating={game.rating}
                  category={game.genres?.map((g) => g.name).join(' / ')}
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
          <Pagination count={count} pageSize={PAGE_SIZE} currentPage={page} basePath="/juegos" extraParams={extraParams} />
        </>
      )}
    </div>
  );
}
