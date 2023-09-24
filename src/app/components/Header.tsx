import React, { useContext } from 'react';
import { APP_TITLE } from '../utils/CONSTANTS';

import { UploadContext, UploadContextType } from '../contexts/UploadContext';

import { HeaderStyles } from '../styles/HeaderStyles';

const Header = () => {   
    const { 
        handleModalOpen
    } = useContext(UploadContext) as UploadContextType;

    return (
        <HeaderStyles>
            <h1>{APP_TITLE}</h1>

            <button 
                onClick={handleModalOpen}
            >Upload</button>
        </HeaderStyles>
    )
}

export default Header;