import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Home from './pages/Home';
import Games from './pages/Games';
import GameDetails from './pages/GameDetails';
import Favorites from './pages/Favorites';
import CategoryGames from './pages/CategoryGames';
import TagGames from './pages/TagGames';
import Publishers from './pages/Publishers';
import PublisherDetail from './pages/PublisherDetail';
import Events from './pages/Events';
import MyEvents from './pages/MyEvents';

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="juegos" element={<Games />} />
          <Route path="juegos/:id" element={<GameDetails />} />
          <Route path="favoritos" element={<Favorites />} />
          <Route path="category/:slug" element={<CategoryGames />} />
          <Route path="tags/:slug" element={<TagGames />} />
          <Route path="publishers" element={<Publishers />} />
          <Route path="publishers/:id" element={<PublisherDetail />} />
          <Route path="eventos" element={<Events />} />
          <Route path="mis-eventos" element={<MyEvents />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
