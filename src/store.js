import { configureStore } from '@reduxjs/toolkit';
import defaultReducer from './reduxSlices/app';
import { apiSlice } from './reduxSlices/apiSlice';

const store = configureStore({
  reducer: {
    app: defaultReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
