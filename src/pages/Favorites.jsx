import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GameCard from '../components/home/GameCard';
import { HeartCrack } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchFavoriteGamesThunk } from '../store/favoritesSlice';

export default function Favorites() {
  const dispatch = useDispatch();
  const { games: favorites, favoriteIds, loading } = useSelector((s) => s.favorites);

  useEffect(() => {
    dispatch(fetchFavoriteGamesThunk());
  }, [dispatch, favoriteIds.length]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Mis Favoritos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
