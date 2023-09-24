import { 
  configureStore,
  PreloadedState
} from '@reduxjs/toolkit';
import { galleryApi } from './galleryApi';
import { setupListeners } from '@reduxjs/toolkit/query';
import galleryReducer from './gallerySlice';
import uploadReducer from './uploadSlice';

export const store = configureStore({
  reducer: {
    // Used with RTK Query
    [galleryApi.reducerPath]: galleryApi.reducer,
    galleryReducer,
    uploadReducer
  },
  // Used with RTK Query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(galleryApi.middleware),
});

// Used with RTK Query
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


// For Testing
export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: {
      [galleryApi.reducerPath]: galleryApi.reducer,
      galleryReducer,
      uploadReducer
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(galleryApi.middleware),
  })
}
export type AppStore = ReturnType<typeof setupStore>