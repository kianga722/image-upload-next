import React from 'react';
import { APP_TITLE } from '../utils/CONSTANTS';
import { useAppDispatch } from "../redux/hooks";
import { openModal } from "../redux/uploadSlice";

import { HeaderStyles } from '../styles/HeaderStyles';

const Header = () => {   
    const dispatch = useAppDispatch();

    function handleModalOpen() {
        dispatch(openModal());
    }

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