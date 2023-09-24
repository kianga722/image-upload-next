import React from 'react';
import { APP_TITLE } from '../utils/CONSTANTS';
import Header from '../components/Header';

// We're using our own custom render function and not RTL's render.
import { renderWithProviders } from './test-utils'

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';


describe("Testing Header", () => {
    test("Should render initial values", () => {
        renderWithProviders(<Header />)
        const h1 = screen.getByRole("heading", {level:1});
        const button = screen.getByRole("button");

        expect(h1).toHaveTextContent(APP_TITLE);
        expect(button).toHaveTextContent("Upload");
    })

    test("Should render same initial values when button is pressed", () => {
        renderWithProviders(<Header />)
        const h1 = screen.getByRole("heading", {level:1});
        const button = screen.getByRole("button");
        userEvent.click(button)

        expect(h1).toHaveTextContent(APP_TITLE);
        expect(button).toHaveTextContent("Upload");
    })
})