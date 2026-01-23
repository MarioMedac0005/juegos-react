import { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Moon, Sun, Gamepad2, Search } from 'lucide-react';

export default function Layout() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'system';
    }
    return 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <Link to="/" className="flex items-center space-x-2 transition-transform hover:scale-105">
            <Gamepad2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">GameDiscovery</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link to="/" className="text-foreground/80 hover:text-primary transition-colors">Inicio</Link>
              <Link to="/juegos" className="text-foreground/80 hover:text-primary transition-colors">Explorar</Link>
              <Link to="/favoritos" className="text-foreground/80 hover:text-primary transition-colors">Favoritos</Link>
            </nav>

            <div className="flex items-center gap-4">
               {/* Search Icon Placeholder */}
               <button className="p-2 rounded-full hover:bg-accent transition-colors md:hidden">
                <Search className="h-5 w-5" />
              </button>

              <button
                onClick={toggleTheme}
                className="rounded-full p-2 hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Alternar tema"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-yellow-400 transition-all hover:rotate-90" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-700 transition-all hover:-rotate-90" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border py-6 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 text-sm text-muted-foreground">
          <p>© 2026 GameDiscovery. Todos los derechos reservados.</p>
           <div className="flex gap-4">
              <a href="#" className="hover:text-foreground">Privacidad</a>
              <a href="#" className="hover:text-foreground">Términos</a>
           </div>
        </div>
      </footer>
    </div>
  );
}
