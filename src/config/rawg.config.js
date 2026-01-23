const RAWG_BASE_URL = "https://api.rawg.io/api";
const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;

export const RAWG_ENDPOINTS = {
  games: `${RAWG_BASE_URL}/games`,
  gameDetails: (id) => `${RAWG_BASE_URL}/games/${id}`,
  genres: `${RAWG_BASE_URL}/genres`,
};

export const RAWG_ORDERING = {
  TRENDING: "-added",
  TOP_RATED: "-rating",
  METACRITIC: "-metacritic",
  RECENT: "-released",
};

export const RAWG_PAGE_SIZE = {
  SMALL: 5,
  MEDIUM: 10,
  LARGE: 20,
  CUSTOM: (size) => size,
};

export const RAWG_DEFAULT_PARAMS = {
  key: RAWG_API_KEY,
};
