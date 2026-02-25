import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchEvents } from '../services/events.service';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const loadJoinedFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('joinedEvents') || '[]');
  } catch {
    return [];
  }
};

const saveJoinedToStorage = (ids) => {
  localStorage.setItem('joinedEvents', JSON.stringify(ids));
};

// ─── Thunk ────────────────────────────────────────────────────────────────────

export const fetchEventsThunk = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchEvents();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    items: [],
    joinedIds: loadJoinedFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    joinEvent(state, action) {
      const id = action.payload;
      if (!state.joinedIds.includes(id)) {
        state.joinedIds.push(id);
        saveJoinedToStorage(state.joinedIds);
      }
    },
    leaveEvent(state, action) {
      const id = action.payload;
      state.joinedIds = state.joinedIds.filter((eid) => eid !== id);
      saveJoinedToStorage(state.joinedIds);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventsThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchEventsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchEventsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { joinEvent, leaveEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
