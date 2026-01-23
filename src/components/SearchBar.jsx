import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative max-w-xl mx-auto mt-8 group z-20 w-full">
      {/* Background Glow */}
      <div className="absolute inset-0 -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur opacity-25 group-focus-within:opacity-70 transition duration-500"></div>
      
      {/* Input */}
      <div className="relative flex items-center bg-card rounded-lg shadow-xl border border-border p-2">
        <Search className="h-5 w-5 text-muted-foreground ml-3" />
        <input 
          type="text" 
          placeholder="Busca juegos, plataformas o géneros..." 
          className="flex-1 bg-transparent border-none focus:ring-0 text-foreground placeholder-muted-foreground px-4 py-2 outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
