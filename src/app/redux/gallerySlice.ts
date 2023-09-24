import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { galleryApi } from "./galleryApi";
import { RootState } from "./store";

export interface GalleryType {
  selectedImage: string | null;
  thumbnails: string[];
  isTruncated: boolean;
  continuationToken: string | null;
}

const initialState: GalleryType = {
  selectedImage: null,
  thumbnails: [],
  isTruncated: true,
  continuationToken: null
};

export const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    setSelectedImage: (state, action: PayloadAction<string>) => {
      state.selectedImage = action.payload;
    },
    resetSelectedImage: (state) => {
      state.selectedImage = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(galleryApi.endpoints.getThumbnails.matchFulfilled, (state, action) => {
      // pretend this field and this payload data exist for sake of example
      const { isTruncated, continuationToken } = action.payload;
      state.isTruncated = isTruncated;
      state.continuationToken = continuationToken;
    });
  }
});
export const { setSelectedImage, resetSelectedImage } = gallerySlice.actions;

export const gallerySelector = (state: RootState) => state.galleryReducer;
export default gallerySlice.reducer;