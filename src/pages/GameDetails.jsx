import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchGameDetails } from '../services/rawg.service';
import { Heart, Calendar, Gamepad2, Star, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const loadGameDetails = async () => {
      setLoading(true);
      try {
        const result = await fetchGameDetails(id);
        if (result.success) {
          setGame(result.data);
          // Verificamos si el juego está en favoritos
          const favorites = JSON.parse(localStorage.getItem('favoriteGames') || '[]');
          // Si está en favoritos, lo marcamos como tal
          setIsFavorite(favorites.includes(result.data.id));
        } else {
          setError(result.error);
        }
      } catch (err) {
        console.error("Error cargando detalles del juego:", err);
        setError("Error inesperado al cargar los detalles.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadGameDetails();
    }
  }, [id]);

  const toggleFavorite = () => {
    if (!game) return;

    const favorites = JSON.parse(localStorage.getItem('favoriteGames') || '[]');
    let newFavorites;

    // Si está en favoritos, lo eliminamos
    if (isFavorite) {
      newFavorites = favorites.filter(favId => favId !== game.id);
      toast.success('Eliminado de favoritos');
    } else {
      // Si no está en favoritos, lo añadimos
      newFavorites = [...favorites, game.id];
      toast.success('Añadido a favoritos');
    }

    // Guardamos los favoritos en localStorage
    localStorage.setItem('favoriteGames', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-screen flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-primary/20 rounded-full mb-4"></div>
            <p className="text-muted-foreground text-lg">Cargando detalles del juego...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-screen text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
        <p className="text-muted-foreground mb-6">{error || "No se encontró el juego"}</p>
        <Link to="/juegos" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Header with Background Image */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
        <img 
          src={game.background_image} 
          alt={game.name} 
          className="w-full h-full object-cover"
        />
        
        <div className="absolute bottom-0 left-0 right-0 z-20 container mx-auto px-4 py-8">
            <Link to="/juegos" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
                <ArrowLeft className="mr-2 h-5 w-5" /> Volver
            </Link>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md mb-2">
                {game.name}
            </h1>
            <div className="flex flex-wrap gap-3 items-center">
                {game.genres?.map(genre => (
                    <span key={genre.id} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium text-white border border-white/20">
                        {genre.name}
                    </span>
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
            
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Galería</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <img src={game.background_image_additional} alt="Screenshot" className="rounded-lg object-cover w-full h-64 hover:scale-[1.02] transition-transform" />
                 </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
             <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Puntuación</span>
                    <div className="flex items-center bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1 rounded-full font-bold">
                        <Star className="w-5 h-5 mr-1 fill-current" />
                        {game.rating} <span className="text-xs opacity-70 ml-1">/ 5</span>
                    </div>
                </div>

                <div className="h-px bg-border" />

                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Fecha de lanzamiento
                    </h3>
                    <p className="text-foreground font-medium">
                        {new Date(game.released).toLocaleDateString('es-ES', { dateStyle: 'long' })}
                    </p>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                        <Gamepad2 className="w-4 h-4 mr-2" />
                        Plataformas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {game.platforms?.map(p => (
                            <span key={p.platform.id} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded border border-border">
                                {p.platform.name}
                            </span>
                        ))}
                    </div>
                </div>

                 <button 
                    onClick={toggleFavorite}
                    className={`w-full flex items-center justify-center py-3 rounded-lg font-bold transition-all duration-300 ${
                        isFavorite 
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20' 
                        : 'bg-secondary hover:bg-secondary/80 text-foreground border border-border'
                    }`}
                >
                    <Heart className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                    {isFavorite ? 'Quitar de Favoritos' : 'Añadir a Favoritos'}
                </button>

                {game.metacritic && (
                    <div className="mt-4 pt-4 border-t border-border">
                         <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Metascore</span>
                            <span className={`px-2 py-1 rounded text-sm font-bold border ${
                                game.metacritic >= 75 ? 'border-green-500 text-green-500' : 
                                game.metacritic >= 50 ? 'border-yellow-500 text-yellow-500' : 'border-red-500 text-red-500'
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
