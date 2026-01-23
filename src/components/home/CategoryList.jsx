import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchGenres } from "../../services/rawg.service";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
   const getGenres = async () => {
      try {
         const result = await fetchGenres();
         if (result.success) {
          setCategories(result.data.map(genre => genre.name));
        } else {
          setError(result.error);
          setCategories(['Acción', 'Aventura', 'RPG', 'Estrategia', 'Simulación', 'Deportes', 'Puzzle', 'Shooter']);
        }
      } catch (err) {
        console.error("Error inesperado al obtener las categorias:", err);
        setError("Ocurrió un error inesperado al cargar las categorias.");
      } finally {
        setLoading(false);
      }
   }
   getGenres();
  }, []);

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="bg-muted/30 rounded-3xl p-8 md:p-12 text-center border border-border/50 relative overflow-hidden">

         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

         <h2 className="text-2xl md:text-4xl font-bold mb-6 relative z-10">¿Listo para empezar?</h2>
         <p className="text-muted-foreground mb-8 max-w-lg mx-auto relative z-10">
            Explora nuestra colección por género y encuentra exactamente lo que buscas.
         </p>

         {loading && <p className="text-muted-foreground mb-4 relative z-10">Cargando categorías...</p>}

         {error && !loading && <p className="text-red-500 mb-4 relative z-10">{error}</p>}

         <div className="flex flex-wrap justify-center gap-3 relative z-10">
            {categories.map(cat => (
               <Link 
                  key={cat} 
                  to={`/category/${cat.toLowerCase()}`}
                  className="px-6 py-3 bg-card rounded-full border border-border shadow-sm text-sm font-medium hover:border-primary hover:text-primary hover:bg-primary/5 hover:scale-105 transition-all duration-300 cursor-pointer"
               >
                  {cat}
               </Link>
            ))}
         </div>
      </div>
    </section>
  );
}
