import React from 'react';
import { useAppDispatch } from "../redux/hooks";
import { setSelectedImage } from "../redux/gallerySlice";

import { ThumbnailStyles } from '../styles/ThumbnailStyles';

export type ThumbnailType = {
    filename: string
};

const Thumbnail = ({ filename }: ThumbnailType )=> {
    const dispatch = useAppDispatch();

    function handleThumbnailClick(thumbnail: string) {
        const fullImage = thumbnail.replace('resized-', '');
        dispatch(setSelectedImage(fullImage));
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