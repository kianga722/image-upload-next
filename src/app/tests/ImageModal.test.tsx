import React from 'react';
import ImageModal from '../components/ImageModal';

import GalleryContextProvider from '../contexts/GalleryContext';

import {render, screen, waitFor } from '@testing-library/react';

describe("Testing ImageModal", () => {
    test("Should render null when image not set", async () => {
        render(
            <GalleryContextProvider initialSelectedImage={null}>
              <ImageModal />
            </GalleryContextProvider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('dialog-img')).not.toBeInTheDocument();
        })
    })

    test("Should render component when image is set", async () => {
        render(
            <GalleryContextProvider initialSelectedImage={'test.jpg'}>
              <ImageModal />
            </GalleryContextProvider>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('dialog-img')).toBeInTheDocument();
        })
    })
})