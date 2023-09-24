'use client'

import React from 'react';
import GalleryContextProvider from '../contexts/GalleryContext';
import UploadContextProvider from '../contexts/UploadContext';

import Header from './Header';
import Gallery from './Gallery';
import ImageModal from './ImageModal';
import UploadModal from './UploadModal';
import MSWComponent from './MSWComponent';

import { Global } from '@emotion/react';
import { global } from '../styles/global-style';

const ClientWrapper = () => {
    return (
        <>
            <MSWComponent />
      
            <Global styles={global} />

            <GalleryContextProvider initialSelectedImage={null}>
                <UploadContextProvider initialModalOpen={false}>
                <div id='content-wrapper'>
                    <Header />

                    <Gallery />

                    <ImageModal />

                    <UploadModal />
                </div>
                </UploadContextProvider>
            </GalleryContextProvider> 
        </>
    )
}

export default ClientWrapper;