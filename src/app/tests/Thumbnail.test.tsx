import React from 'react';
import Thumbnail from '../components/Thumbnail';

import GalleryContextProvider from '../contexts/GalleryContext';

import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe("Testing Thumbnail", () => {
    test("Should render the image thumbnail", () => {
        render(
            <GalleryContextProvider initialSelectedImage={null}>
                <Thumbnail filename={'test.jpg'} />
            </GalleryContextProvider>
        )

        const img: HTMLImageElement = screen.getByRole("img");
        expect(img.src).toContain('test')
    })

    test("Should render the same image thumbnail after click", () => {
        render(
            <GalleryContextProvider initialSelectedImage={null}>
                <Thumbnail filename={'test.jpg'} />
            </GalleryContextProvider>
        )

        const img: HTMLImageElement = screen.getByRole("img");
        expect(img.src).toContain('test');

        const button = screen.getByRole("button");
        act(() => {
            userEvent.click(button)
        });

        expect(img.src).toContain('test');
    })
})