import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GameCard({ id, title, rating, category, color, description, image }) {
  return (
    <Link to={`/juegos/${id}`} className="block group relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      
      {/* Imagen del juego */}
      <div className="h-48 w-full overflow-hidden rounded-t-xl">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          // fallback si no hay imagen
          <div className={`h-full w-full bg-gradient-to-br ${color} flex items-center justify-center p-4`}>
            <span className="text-white/50 text-2xl font-bold">🎮</span>
          </div>
        )}
      </div>

      {/* Contenido del card */}
      <div className="p-5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-primary/80 uppercase tracking-wider">{category}</span>
          <div className="flex items-center bg-secondary/50 px-2 py-1 rounded text-xs font-bold text-foreground">
            <Star className="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500" />
            {rating}
          </div>
        </div>
        <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {description || `Vive la emoción de ${title}. Una aventura épica te espera en esta obra maestra del género.`}
        </p>
      </div>
    </Link>
  );
}
