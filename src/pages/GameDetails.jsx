import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Calendar, Gamepad2, Star, ArrowLeft, Tag, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchGameDetailsThunk, clearDetail } from '../store/gamesSlice';
import { toggleFavorite } from '../store/favoritesSlice';

export default function GameDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { detail: game, loading, error } = useSelector((s) => s.games);
  const { favoriteIds } = useSelector((s) => s.favorites);
  const isFavorite = game ? favoriteIds.includes(game.id) : false;

  useEffect(() => {
    if (id) dispatch(fetchGameDetailsThunk(id));
    return () => { dispatch(clearDetail()); };
  }, [dispatch, id]);

  const handleToggleFavorite = () => {
    if (!game) return;
    dispatch(toggleFavorite(game.id));
    if (isFavorite) {
      toast.success('Eliminado de favoritos');
    } else {
      toast.success('Añadido a favoritos');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-screen flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary/20 rounded-full mb-4" />
          <p className="text-muted-foreground text-lg">Cargando detalles del juego...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-screen text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
        <p className="text-muted-foreground mb-6">{error || 'No se encontró el juego'}</p>
        <Link to="/juegos" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Header */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
        <img src={game.background_image} alt={game.name} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 z-20 container mx-auto px-4 py-8">
          <Link to="/juegos" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="mr-2 h-5 w-5" /> Volver
          </Link>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md mb-2">
            {game.name}
          </h1>
          <div className="flex flex-wrap gap-3 items-center">
            {game.genres?.map((genre) => (
              <Link
                key={genre.id}
                to={`/category/${genre.slug}`}
                className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium text-white border border-white/20 hover:bg-white/25 transition-colors"
              >
                {genre.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Sobre el juego</h2>
              <div
                className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: game.description || game.description_raw }}
              />
            </div>

            {game.tags && game.tags.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary" /> Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {game.tags.slice(0, 20).map((tag) => (
                    <Link
                      key={tag.id}
                      to={`/tags/${tag.slug}`}
                      className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {game.background_image_additional && (
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Galería</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <img
                    src={game.background_image_additional}
                    alt="Screenshot"
                    className="rounded-lg object-cover w-full h-64 hover:scale-[1.02] transition-transform"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
              {/* Rating */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Puntuación</span>
                <div className="flex items-center bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1 rounded-full font-bold">
                  <Star className="w-5 h-5 mr-1 fill-current" />
                  {game.rating} <span className="text-xs opacity-70 ml-1">/ 5</span>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Release date */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" /> Fecha de lanzamiento
                </h3>
                <p className="text-foreground font-medium">
                  {game.released
                    ? new Date(game.released).toLocaleDateString('es-ES', { dateStyle: 'long' })
                    : 'Desconocida'}
                </p>
              </div>

              <div className="h-px bg-border" />

              {/* Platforms */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                  <Gamepad2 className="w-4 h-4 mr-2" /> Plataformas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {game.platforms?.map((p) => (
                    <span key={p.platform.id} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded border border-border">
                      {p.platform.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Publishers */}
              {game.publishers && game.publishers.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                    <Building2 className="w-4 h-4 mr-2" /> Publisher
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {game.publishers.map((pub) => (
                      <Link
                        key={pub.id}
                        to={`/publishers/${pub.id}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {pub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Favorite button */}
              <button
                onClick={handleToggleFavorite}
                className={`w-full flex items-center justify-center py-3 rounded-lg font-bold transition-all duration-300 ${
                  isFavorite
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20'
                    : 'bg-secondary hover:bg-secondary/80 text-foreground border border-border'
                }`}
              >
                <Heart className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Quitar de Favoritos' : 'Añadir a Favoritos'}
              </button>

              {/* Metacritic */}
              {game.metacritic && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Metascore</span>
                    <span className={`px-2 py-1 rounded text-sm font-bold border ${
                      game.metacritic >= 75 ? 'border-green-500 text-green-500' :
                      game.metacritic >= 50 ? 'border-yellow-500 text-yellow-500' :
                      'border-red-500 text-red-500'
                    }`}>
                      {game.metacritic}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
