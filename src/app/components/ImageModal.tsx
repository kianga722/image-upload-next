import React, { useContext } from 'react';

import { GalleryContext, GalleryContextType } from '../contexts/GalleryContext';

import { ImageModalStyles } from '../styles/ImageModalStyles';
  
const ImageModal = ()  => {
    const { 
        selectedImage,
        handleClose
    } = useContext(GalleryContext) as GalleryContextType;

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