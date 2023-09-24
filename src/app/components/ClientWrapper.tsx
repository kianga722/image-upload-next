'use client'

import React from 'react';
import { Provider } from 'react-redux/es/exports';
import { store } from '../redux/store';

import Header from './Header';
import Gallery from './Gallery';
import ImageModal from './ImageModal';
import UploadModal from './UploadModal';
import MSWComponent from './MSWComponent';

import { Global } from '@emotion/react';
import { global } from '../styles/global-style';

const ClientWrapper = () => {
    return (
        <Provider store={store}>
            <MSWComponent />
      
            <Global styles={global} />
                <div id='content-wrapper'>
                    <Header />

                    <Gallery />

                    <ImageModal />

                    <UploadModal />
                </div>
        </Provider>
    )
}

export default ClientWrapper;