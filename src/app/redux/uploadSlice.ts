import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface UploadType {
  isUploadModalOpen: boolean;
}

const initialState: UploadType = {
  isUploadModalOpen: false
};

export const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction) => {
      state.isUploadModalOpen = true;
    },
    closeModal: (state, action: PayloadAction) => {
      state.isUploadModalOpen = false;
    },
  },
});
export const { openModal, closeModal } = uploadSlice.actions;

export const uploadSelector = (state: RootState) => state.uploadReducer.isUploadModalOpen;
export default uploadSlice.reducer;