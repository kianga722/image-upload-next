import React, { createContext, useState } from 'react';

export type UploadContextType = {
    isUploadModalOpen: boolean;
    handleModalOpen: () => void;
    handleModalClose: () => void;
};

export const UploadContext = createContext<UploadContextType | null>(null);

const UploadContextProvider = ({children, initialModalOpen=true}: {children: React.ReactElement, initialModalOpen: boolean}) => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(initialModalOpen)

    function handleModalOpen() {
        setIsUploadModalOpen(true)
    }

    function handleModalClose() {
        setIsUploadModalOpen(false)
    }

    return (
        <UploadContext.Provider value={{ 
            isUploadModalOpen,
            handleModalOpen,
            handleModalClose,
        }}>
            {children}
        </UploadContext.Provider>
    )
}


export default UploadContextProvider;