import React from 'react';
import Thumbnail from '../components/Thumbnail';

// We're using our own custom render function and not RTL's render.
import { renderWithProviders } from './test-utils';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';


describe("Testing Thumbnail", () => {
    test("Should render the image thumbnail", () => {
        const props = {
            filename: 'test.jpg'
        }
        renderWithProviders(<Thumbnail {...props} />)

        const img: HTMLImageElement = screen.getByRole("img");
        expect(img.src).toContain('test')
    })

    test("Should render the same image thumbnail after click", () => {
        const props = {
            filename: 'test.jpg'
        }
        renderWithProviders(<Thumbnail {...props} />)

        const img: HTMLImageElement = screen.getByRole("img");
        expect(img.src).toContain('test');

        const button = screen.getByRole("button");
        userEvent.click(button);
        expect(img.src).toContain('test');
    })
})