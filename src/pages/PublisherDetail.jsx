import { useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPublisherDetailsThunk, fetchGamesThunk } from '../store/gamesSlice';
import GameCard from '../components/home/GameCard';
import Pagination from '../components/Pagination';
import { ArrowLeft, Building2 } from 'lucide-react';

const PAGE_SIZE = 12;

export default function PublisherDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const dispatch = useDispatch();
  const { publisherDetail: publisher, items: games, count, loading, error } = useSelector((s) => s.games);

  useEffect(() => {
    if (id) {
      dispatch(fetchPublisherDetailsThunk(id));
      dispatch(fetchGamesThunk({ publishers: id, pageSize: PAGE_SIZE, page }));
    }
  }, [dispatch, id, page]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-screen flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary/20 rounded-full mb-4" />
          <p className="text-muted-foreground text-lg">Cargando publisher...</p>
        </div>
      </div>
    );
  }

  if (error || !publisher) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-screen text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
        <p className="text-muted-foreground mb-6">{error || 'No se encontró el publisher'}</p>
        <Link to="/publishers" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          Ver publishers
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      {publisher.image_background && (
        <div className="relative h-64 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent z-10" />
          <img src={publisher.image_background} alt={publisher.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <Link to="/publishers" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Ver todos los publishers
        </Link>

        {/* Publisher Info */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-10">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{publisher.name}</h1>
              <p className="text-muted-foreground text-sm mb-4">
                {publisher.games_count?.toLocaleString()} juegos publicados
              </p>
              {publisher.description && (
                <div
                  className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: publisher.description }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Games */}
        <h2 className="text-2xl font-bold mb-6">Juegos de {publisher.name}</h2>
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
                color="from-orange-500 to-amber-500"
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-xl text-muted-foreground">No se encontraron juegos de este publisher.</p>
            </div>
          )}
        </div>
        <Pagination count={count} pageSize={PAGE_SIZE} currentPage={page} basePath={`/publishers/${id}`} />
      </div>
    </div>
  );
}
