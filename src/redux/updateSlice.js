import { createSlice } from "@reduxjs/toolkit";

const updateSlice = createSlice({
  name: "bulk",
  initialState: [],
  reducers: {
    updateMultiple: (state, action) => {
      state.push(...action.payload)
    },
    clearBulk: (state, action) => {
      return []
    },
  },
});

export const {
  updateMultiple,clearBulk
} = updateSlice.actions;

export const bulkList = (state) => state.bulk;

export default updateSlice.reducer;
