import React from 'react';
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { resetSelectedImage, gallerySelector } from "../redux/gallerySlice";

import { ImageModalStyles } from '../styles/ImageModalStyles';
  
const ImageModal = ()  => {
    const galleryState = useAppSelector(gallerySelector);
    const dispatch = useAppDispatch();

    const { selectedImage } = galleryState;

    function handleClose() {
        dispatch(resetSelectedImage());
      }

    if (selectedImage === null) {
        return null
    }

    return (
        <ImageModalStyles
            onClick={handleClose}
        >
            <dialog
            >
                <button
                    onClick={handleClose}
                >&times;</button>

                <picture>
                    <img
                        data-testid='dialog-img'
                        onClick={e => {
                            e.stopPropagation();
                        }} 
                        src={`${process.env.NEXT_PUBLIC_BUCKET_URL_IMAGES}${selectedImage}`} 
                    />
                </picture>
            </dialog>
        </ImageModalStyles>
    )
}

export default ImageModal;