import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchTrendingGames,
  fetchGames,
  fetchGameDetails,
  fetchPublishers,
  fetchPublisherDetails,
} from '../services/rawg.service';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchTrendingGamesThunk = createAsyncThunk(
  'games/fetchTrending',
  async ({ pageSize = 5, search = '' } = {}, { rejectWithValue }) => {
    const result = await fetchTrendingGames(pageSize, search);
    if (!result.success) return rejectWithValue(result.error);
    return result;
  }
);

export const fetchGamesThunk = createAsyncThunk(
  'games/fetchGames',
  async (params = {}, { rejectWithValue }) => {
    const result = await fetchGames(params);
    if (!result.success) return rejectWithValue(result.error);
    return result;
  }
);

export const fetchGameDetailsThunk = createAsyncThunk(
  'games/fetchGameDetails',
  async (id, { rejectWithValue }) => {
    const result = await fetchGameDetails(id);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const fetchPublishersThunk = createAsyncThunk(
  'games/fetchPublishers',
  async (params = {}, { rejectWithValue }) => {
    const result = await fetchPublishers(params);
    if (!result.success) return rejectWithValue(result.error);
    return result;
  }
);

export const fetchPublisherDetailsThunk = createAsyncThunk(
  'games/fetchPublisherDetails',
  async (id, { rejectWithValue }) => {
    const result = await fetchPublisherDetails(id);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const gamesSlice = createSlice({
  name: 'games',
  initialState: {
    // game list
    items: [],
    count: 0,
    // single game detail
    detail: null,
    // trending (home)
    trending: [],
    // publishers
    publishers: [],
    publishersCount: 0,
    publisherDetail: null,
    // request state
    loading: false,
    error: null,
  },
  reducers: {
    clearDetail(state) {
      state.detail = null;
    },
  },
  extraReducers: (builder) => {
    // ── Trending ──
    builder
      .addCase(fetchTrendingGamesThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTrendingGamesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.trending = action.payload.data;
      })
      .addCase(fetchTrendingGamesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Games list ──
    builder
      .addCase(fetchGamesThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchGamesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.count = action.payload.count;
      })
      .addCase(fetchGamesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Game detail ──
    builder
      .addCase(fetchGameDetailsThunk.pending, (state) => { state.loading = true; state.error = null; state.detail = null; })
      .addCase(fetchGameDetailsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
      })
      .addCase(fetchGameDetailsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Publishers list ──
    builder
      .addCase(fetchPublishersThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPublishersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.publishers = action.payload.data;
        state.publishersCount = action.payload.count;
      })
      .addCase(fetchPublishersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Publisher detail ──
    builder
      .addCase(fetchPublisherDetailsThunk.pending, (state) => { state.loading = true; state.error = null; state.publisherDetail = null; })
      .addCase(fetchPublisherDetailsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.publisherDetail = action.payload;
      })
      .addCase(fetchPublisherDetailsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDetail } = gamesSlice.actions;
export default gamesSlice.reducer;
