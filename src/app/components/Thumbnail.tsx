import React, { useContext } from 'react';

import { GalleryContext, GalleryContextType } from '../contexts/GalleryContext';

import { ThumbnailStyles } from '../styles/ThumbnailStyles';

export type ThumbnailType = {
    filename: string
};

const Thumbnail = ({ filename }: ThumbnailType )=> {
    const { 
        setSelectedImage,
    } = useContext(GalleryContext) as GalleryContextType;

    function handleThumbnailClick(thumbnail: string) {
        const fullImage = thumbnail.replace('resized-', '');
        setSelectedImage(fullImage)
    }
    
    return (
        <ThumbnailStyles>
            <button
                onClick={() => [
                    handleThumbnailClick(filename)
                ]}
            >
                <img 
                    loading="lazy"
                    src={`${process.env.NEXT_PUBLIC_BUCKET_URL_THUMBNAILS}${filename}`} 
                />
            </button>
        </ThumbnailStyles>
    )
}

export default Thumbnail;