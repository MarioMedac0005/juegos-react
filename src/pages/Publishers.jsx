import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchPublishers } from '../services/rawg.service';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import { Building2, Gamepad2 } from 'lucide-react';

const PAGE_SIZE = 20;

export default function Publishers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';

  const [publishers, setPublishers] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await fetchPublishers({ page, pageSize: PAGE_SIZE, search });
        if (result.success) {
          setPublishers(result.data);
          setCount(result.count || 0);
          setError(null);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Error al cargar los publishers.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, search]);

  // Debounce search → update URL
  useEffect(() => {
    const id = setTimeout(() => {
      const params = { page: '1' };
      if (searchInput) params.search = searchInput;
      setSearchParams(params);
    }, 500);
    return () => clearTimeout(id);
  }, [searchInput]);

  const extraParams = {};
  if (search) extraParams.search = search;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col items-center gap-6 mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-center tracking-tight flex items-center gap-3">
          <Building2 className="h-10 w-10 text-primary" />
          Publishers
        </h1>
        <p className="text-muted-foreground text-center max-w-2xl">
          Descubre las compañías que han publicado los mejores videojuegos.
        </p>
        <SearchBar value={searchInput} onChange={setSearchInput} placeholder="Buscar publisher..." />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(PAGE_SIZE)].map((_, i) => (
            <div key={i} className="h-48 bg-card rounded-xl animate-pulse border border-border" />
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {publishers.length > 0 ? (
              publishers.map((pub) => (
                <Link
                  key={pub.id}
                  to={`/publishers/${pub.id}`}
                  className="group relative bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300"
                >
                  {pub.image_background ? (
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={pub.image_background}
                        alt={pub.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    </div>
                  ) : (
                    <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-primary/40" />
                    </div>
                  )}
                  <div className="p-4">
                    <h2 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">{pub.name}</h2>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Gamepad2 className="w-4 h-4" />
                      <span>{pub.games_count?.toLocaleString()} juegos</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-xl text-muted-foreground">No se encontraron publishers.</p>
              </div>
            )}
          </div>
          <Pagination count={count} pageSize={PAGE_SIZE} currentPage={page} basePath="/publishers" extraParams={extraParams} />
        </>
      )}
    </div>
  );
}
