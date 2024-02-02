import { createSlice } from '@reduxjs/toolkit';

export const stateSlice = createSlice({
  name: 'main',
  initialState: {
    userContext: {},
    userData: {},
    filter: '',
    search: '',
  },
  reducers: {
    setUserContext: (state, action) => {
      state.userContext = action.payload;
    },
    unsetUserContext: (state) => {
      state.userContext = {};
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    unsetUserData: (state) => {
      state.userData = {};
    },
    setUserSearch: (state, action) => {
      state.search = action.payload;
    },
    unsetUserSearch: (state) => {
      state.search = '';
    },
    setUserFilter: (state, action) => {
      state.filter = action.payload;
    },
    unsetUserFilter: (state) => {
      state.filter = '';
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setUserContext,
  unsetUserContext,
  setUserSearch,
  unsetUserSearch,
  setUserData,
  unsetUserData,
  setUserFilter,
  unsetUserFilter,
} = stateSlice.actions;

export default stateSlice.reducer;
