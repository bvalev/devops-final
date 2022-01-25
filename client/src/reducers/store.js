import { configureStore } from '@reduxjs/toolkit';
import {playlistsApi} from "./playlists";

export const store = configureStore({
  reducer: {
    [playlistsApi.reducerPath]: playlistsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(playlistsApi.middleware),
});
