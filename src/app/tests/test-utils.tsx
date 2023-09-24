import React, { PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import type { PreloadedState } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

import type { 
    AppStore, 
    RootState,
} from '../redux/store'
// As a basic setup, import your same slice reducers
import { galleryApi } from '../redux/galleryApi';
import galleryReducer from '../redux/gallerySlice';
import uploadReducer from '../redux/uploadSlice';

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>
  store?: AppStore
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState,
    // Automatically create a store instance if no store was passed in
    store = configureStore({
        reducer: {
            [galleryApi.reducerPath]: galleryApi.reducer,
            galleryReducer,
            uploadReducer
        },
        preloadedState ,
        middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(galleryApi.middleware),
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}