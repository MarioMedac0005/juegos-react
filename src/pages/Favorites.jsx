import { useState, useEffect } from 'react';
import { fetchGameDetails } from '../services/rawg.service';
import GameCard from '../components/home/GameCard';
import { HeartCrack } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      const favoriteIds = JSON.parse(localStorage.getItem('favoriteGames') || '[]');
      
      if (favoriteIds.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      try {
        // Fetch a los juegos favoritos, uno por uno
        const promises = favoriteIds.map(id => fetchGameDetails(id));
        // Esperamos a que todos los fetches terminen
        const results = await Promise.all(promises);
        
        // Filtramos los que fallan y nos quedamos con los que si funcionan
        const games = results
          .filter(r => r.success)
          .map(r => r.data);
          
        setFavorites(games);
      } catch (err) {
        console.error("Error cargando favoritos:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Mis Favoritos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Renderizar un skeleton de 4 juegos */}
           {[...Array(4)].map((_, i) => (
             <div key={i} className="h-80 bg-card rounded-xl animate-pulse border border-border"></div>
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl md:text-5xl font-bold mb-2">Mis Favoritos</h1>
      <p className="text-muted-foreground mb-12">Tu colección personal de juegos legendarios.</p>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((game) => (
            <GameCard
              key={game.id}
              id={game.id}
              title={game.name}
              rating={game.rating}
              category={game.genres?.map(g => g.name).join(" / ")}
              image={game.background_image}
              description={game.description_raw}
              color="from-pink-500 to-rose-500"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-80">
          <div className="bg-secondary/50 p-6 rounded-full mb-6">
             <HeartCrack className="w-16 h-16 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Aún no tienes favoritos</h2>
          <p className="text-muted-foreground max-w-md mb-8">
            Explora nuestra colección y marca los juegos que más te gusten para guardarlos aquí.
          </p>
          <Link 
            to="/juegos" 
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Explorar Juegos
          </Link>
        </div>
      )}
    </div>
  );
}
