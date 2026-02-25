import { configureStore } from '@reduxjs/toolkit';
import gamesReducer from './gamesSlice';
import favoritesReducer from './favoritesSlice';
import eventsReducer from './eventsSlice';

const store = configureStore({
  reducer: {
    games: gamesReducer,
    favorites: favoritesReducer,
    events: eventsReducer,
  },
});

export default store;
