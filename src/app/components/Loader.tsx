import React from 'react';

import { LoaderStyles } from '../styles/LoaderStyles';

const Loader = () => {
    return (
        <LoaderStyles 
            className='loading-icon'
            data-testid='loader'
        >
            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        </LoaderStyles>
    )
}

export default Loader;