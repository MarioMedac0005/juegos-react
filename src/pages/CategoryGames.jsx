import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGamesThunk } from '../store/gamesSlice';
import GameCard from '../components/home/GameCard';
import Pagination from '../components/Pagination';
import { Layers, ArrowLeft } from 'lucide-react';

const PAGE_SIZE = 12;

export default function CategoryGames() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const dispatch = useDispatch();
  const { items: games, count, loading, error } = useSelector((s) => s.games);

  const title = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Categoría';

  useEffect(() => {
    if (slug) dispatch(fetchGamesThunk({ genres: slug.toLowerCase(), pageSize: PAGE_SIZE, page }));
  }, [dispatch, slug, page]);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col gap-6 mb-12">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver al inicio
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight capitalize flex items-center gap-3">
              <Layers className="h-8 w-8 md:h-10 md:w-10 text-primary" />
              {title}
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Explorando los mejores juegos de {slug}.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(PAGE_SIZE)].map((_, i) => (
            <div key={i} className="h-72 bg-card rounded-xl animate-pulse border border-border" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-500 text-xl font-bold mb-4">{error}</p>
          <Link to="/" className="text-primary hover:underline">Volver a intentar</Link>
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
                  description={game.description_raw}
                  color="from-blue-500 to-cyan-500"
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-xl text-muted-foreground">No se encontraron juegos en esta categoría.</p>
              </div>
            )}
          </div>
          <Pagination count={count} pageSize={PAGE_SIZE} currentPage={page} basePath={`/category/${slug}`} />
        </>
      )}
    </div>
  );
}
