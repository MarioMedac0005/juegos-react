import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { Moon, Sun, Gamepad2, UserCircle2, Heart, Ticket, ChevronDown } from 'lucide-react';

export default function Layout() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'system';
    }
    return 'system';
  });
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      return;
    }
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-foreground/70 hover:text-primary'}`;

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 transition-transform hover:scale-105">
            <Gamepad2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">GameDiscovery</span>
          </Link>

          {/* Nav + Actions */}
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <NavLink to="/" end className={navLinkClass}>Inicio</NavLink>
              <NavLink to="/juegos" className={navLinkClass}>Explorar</NavLink>
              <NavLink to="/publishers" className={navLinkClass}>Publishers</NavLink>
              <NavLink to="/eventos" className={navLinkClass}>Eventos</NavLink>
            </nav>

            <div className="flex items-center gap-2">
              {/* Theme toggle */}
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

              {/* User profile dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:border-primary/60 hover:bg-accent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Perfil de usuario"
                >
                  <UserCircle2 className="h-6 w-6 text-primary" />
                  <span className="hidden sm:block text-sm font-medium">Mario</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown menu */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-card shadow-xl shadow-black/10 dark:shadow-black/30 overflow-hidden animate-in fade-in-0 zoom-in-95">
                    {/* Profile header */}
                    <div className="px-4 py-3 border-b border-border bg-secondary/30">
                      <p className="text-xs text-muted-foreground">Sesión iniciada como</p>
                      <p className="font-semibold text-sm truncate">mario@gamediscovery.com</p>
                    </div>
                    {/* Menu items */}
                    <div className="py-1">
                      <Link
                        to="/favoritos"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                      >
                        <Heart className="w-4 h-4 text-rose-500" />
                        Mis Favoritos
                      </Link>
                      <Link
                        to="/mis-eventos"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                      >
                        <Ticket className="w-4 h-4 text-primary" />
                        Mis Eventos
                      </Link>
                    </div>
                  </div>
                )}
              </div>
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
