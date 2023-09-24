import React from 'react';
import ImageModal from '../components/ImageModal';

import { setupStore } from '../redux/store';
// We're using our own custom render function and not RTL's render.
import { renderWithProviders } from './test-utils';
import { setSelectedImage, resetSelectedImage } from "../redux/gallerySlice";

import { act, screen } from '@testing-library/react';


describe("Testing ImageModal", () => {
    test("Should render null when image not set", () => {
        const { container } = renderWithProviders(<ImageModal />)

        expect(container).toBeEmptyDOMElement;
    })

    test("Should render component when image is set", () => {
        const store = setupStore()
        store.dispatch(setSelectedImage('test.jpg'))
        renderWithProviders(<ImageModal />, { store })

        const img = screen.getByRole("img");

        expect(img).toBeInTheDocument();
    })

    test("Should render null when image is reset", () => {
        const store = setupStore()
        act(() => {
            store.dispatch(setSelectedImage('test.jpg'))
        })
        const { container } = renderWithProviders(<ImageModal />, { store })

        const img = screen.getByRole("img");

        expect(img).toBeInTheDocument();

        act(() => {
            store.dispatch(resetSelectedImage())
        })

        expect(container).toBeEmptyDOMElement;
    })
})