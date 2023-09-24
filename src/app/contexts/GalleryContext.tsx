import React, { createContext, useState } from 'react';

export type GalleryContextType = {
    selectedImage: string | null;
    setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
    handleClose: () => void
};

export const GalleryContext = createContext<GalleryContextType | null>(null);

const GalleryContextProvider = ({children, initialSelectedImage=null}: {children: React.ReactElement, initialSelectedImage: string | null}) => {

    const [selectedImage, setSelectedImage] = useState<string | null>(initialSelectedImage)

    const handleClose = () => {
        setSelectedImage(null)
    }

    return (
        <GalleryContext.Provider value={{ 
            selectedImage,
            setSelectedImage,
            handleClose
        }}>
            {children}
        </GalleryContext.Provider>
    )
}


export default GalleryContextProvider;