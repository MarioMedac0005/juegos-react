import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchGameDetails } from '../services/rawg.service';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const loadFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('favoriteGames') || '[]');
  } catch {
    return [];
  }
};

const saveToStorage = (ids) => {
  localStorage.setItem('favoriteGames', JSON.stringify(ids));
};

// ─── Thunk ────────────────────────────────────────────────────────────────────

/** Fetches full game objects for all stored favorite IDs */
export const fetchFavoriteGamesThunk = createAsyncThunk(
  'favorites/fetchGames',
  async (_, { getState, rejectWithValue }) => {
    const { favoriteIds } = getState().favorites;
    if (favoriteIds.length === 0) return [];
    try {
      const results = await Promise.all(favoriteIds.map((id) => fetchGameDetails(id)));
      return results.filter((r) => r.success).map((r) => r.data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    favoriteIds: loadFromStorage(),
    games: [],
    loading: false,
    error: null,
  },
  reducers: {
    toggleFavorite(state, action) {
      const id = action.payload;
      if (state.favoriteIds.includes(id)) {
        state.favoriteIds = state.favoriteIds.filter((favId) => favId !== id);
        state.games = state.games.filter((g) => g.id !== id);
      } else {
        state.favoriteIds.push(id);
      }
      saveToStorage(state.favoriteIds);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoriteGamesThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchFavoriteGamesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.games = action.payload;
      })
      .addCase(fetchFavoriteGamesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
