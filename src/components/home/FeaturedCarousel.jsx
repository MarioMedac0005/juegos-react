import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';
import { fetchTrendingGames } from '../../services/rawg.service';
import { Star } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

export default function FeaturedCarousel() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const result = await fetchTrendingGames(10, '', 2); 
        if (result.success) {
          setGames(result.data);
        }
      } catch (err) {
        console.error("Error cargando los juegos del carrusel:", err);
      } finally {
        setLoading(false);
      }
    };
    loadGames();
  }, []);

  if (loading || games.length === 0) return null;

  return (
    <section className="container mx-auto px-4 mb-8">
      <div className="w-full">
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 80,
            modifier: 2,
            slideShadows: false,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={true}
          modules={[EffectCoverflow, Pagination, Autoplay]}
          className="w-full py-2"
          style={{ paddingTop: '5px', paddingBottom: '30px' }}
        >
          {games.map((game) => (
            <SwiperSlide 
                key={game.id} 
                className="w-[200px] sm:w-[250px] md:w-[320px] aspect-video rounded-xl overflow-hidden shadow-lg relative group transition-all duration-300 hover:shadow-primary/20"
                style={{ height: 'auto' }}
            >
                <Link to={`/juegos/${game.id}`} className="block w-full h-full">
                    {/* Image */}
                    <div 
                        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${game.background_image})` }}
                    />
                    
                    {/* Simple Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 flex flex-col justify-end h-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-white font-bold text-xl truncate drop-shadow-md">{game.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-white/90 text-sm font-medium">{game.rating}</span>
                        </div>
                    </div>
                </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        .swiper-pagination-bullet {
            background: rgba(var(--primary), 0.3);
            opacity: 1;
        }
        .swiper-pagination-bullet-active {
            background: hsl(var(--primary));
        }
      `}</style>
    </section>
  );
}
