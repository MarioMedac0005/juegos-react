import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { fetchGames } from '../services/rawg.service';
import GameCard from '../components/home/GameCard';
import Pagination from '../components/Pagination';
import { Tag, ArrowLeft } from 'lucide-react';

const PAGE_SIZE = 12;

export default function TagGames() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [games, setGames] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const title = slug ? slug.replace(/-/g, ' ') : 'Tag';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await fetchGames({ tags: slug, pageSize: PAGE_SIZE, page });
        if (result.success) {
          setGames(result.data);
          setCount(result.count || 0);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Error al cargar los juegos de este tag.');
      } finally {
        setLoading(false);
      }
    };
    if (slug) load();
  }, [slug, page]);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col gap-6 mb-12">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver al inicio
        </Link>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight capitalize flex items-center gap-3">
          <Tag className="h-8 w-8 text-primary" />
          {title}
        </h1>
        <p className="text-muted-foreground text-lg">Juegos con el tag "{title}".</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(PAGE_SIZE)].map((_, i) => (
            <div key={i} className="h-72 bg-card rounded-xl animate-pulse border border-border" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-500 text-xl font-bold">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.length > 0 ? (
              games.map((game) => (
                <GameCard
                  key={game.id}
                  id={game.id}
                  title={game.name}
                  rating={game.rating}
                  category={game.genres?.map((g) => g.name).join(' / ')}
                  image={game.background_image}
                  color="from-teal-500 to-emerald-500"
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-xl text-muted-foreground">No se encontraron juegos con este tag.</p>
              </div>
            )}
          </div>
          <Pagination count={count} pageSize={PAGE_SIZE} currentPage={page} basePath={`/tags/${slug}`} />
        </>
      )}
    </div>
  );
}
