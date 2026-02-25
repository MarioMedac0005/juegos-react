// events.service.js
// Añade o modifica los eventos al gusto
// Las imágenes pueden ser las que tengas en la carpeta public

export const events = [
  {
    id: 1,
    title: "Gaming Expo 2025",
    location: "New York",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Indie Game Developers Meetup",
    location: "San Francisco",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Esports Championship",
    location: "Los Angeles",
    image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Retro Gaming Festival",
    location: "Chicago",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "VR Worlds Summit",
    location: "Seattle",
    image: "https://images.unsplash.com/photo-1617802690658-1173a812650d?w=800&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Game Design Workshop",
    location: "Austin",
    image: "https://images.unsplash.com/photo-1516321165247-4aa89a48be55?w=800&auto=format&fit=crop",
  },
];

// Simula una petición API que devuelve los eventos después de un pequeño retraso.
export const fetchEvents = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(events);
    }, 500); // Simula un retraso de 500 milisegundos
  });
};
