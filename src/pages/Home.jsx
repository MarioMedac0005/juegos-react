import Hero from '../components/home/Hero';
import FeaturedCarousel from '../components/home/FeaturedCarousel';
import FeaturedGames from '../components/home/FeaturedGames';
import CategoryList from '../components/home/CategoryList';

export default function Home() {
  return (
    <div className="flex flex-col gap-8 pb-16">
      <Hero />
      <FeaturedCarousel />
      <FeaturedGames />
      <CategoryList />
    </div>
  );
}
