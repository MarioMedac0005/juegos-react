export default function Hero() {
  return (
    <section className="relative px-4 pt-20 md:pt-32 pb-24 overflow-visible">
       {/* Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-50 dark:opacity-20 animate-pulse-slow" />

      <div className="container mx-auto text-center space-y-8 max-w-4xl relative z-10">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary shadow-[0_0_10px_rgba(var(--primary),0.2)]">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
          v2.0 Disponible
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground text-balance drop-shadow-sm">
          Descubre tu próxima <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 animate-gradient-x">
            Pasión Virtual
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
          Explora miles de títulos, sigue tu colección y encuentra joyas ocultas.
          La base de datos definitiva para el jugador moderno.
        </p>

        <div className="pt-8 flex justify-center gap-8 text-sm text-muted-foreground">
           <div className="flex flex-col items-center">
              <span className="font-bold text-foreground text-lg">10k+</span>
              <span>Juegos</span>
           </div>
           <div className="w-px h-10 bg-border"></div>
           <div className="flex flex-col items-center">
              <span className="font-bold text-foreground text-lg">5M+</span>
              <span>Reseñas</span>
           </div>
           <div className="w-px h-10 bg-border"></div>
           <div className="flex flex-col items-center">
              <span className="font-bold text-foreground text-lg">24/7</span>
              <span>Comunidad</span>
           </div>
        </div>
      </div>
    </section>
  );
}
