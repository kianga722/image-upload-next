import React from 'react';
import { APP_TITLE } from '../utils/CONSTANTS';
import Header from '../components/Header';

import UploadContextProvider from '../contexts/UploadContext';

import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe("Testing Header", () => {

    test("Should render initial values", () => {
        render(
            <UploadContextProvider initialModalOpen={false}>
              <Header />
            </UploadContextProvider>
        );

        const h1 = screen.getByRole("heading", {level:1});
        const button = screen.getByRole("button");

        expect(h1).toHaveTextContent(APP_TITLE);
        expect(button).toHaveTextContent("Upload");
    })

    test("Should render same initial values when button is pressed", () => {
        render(
            <UploadContextProvider initialModalOpen={false}>
              <Header />
            </UploadContextProvider>
        );

        const h1 = screen.getByRole("heading", {level:1});
        const button = screen.getByRole("button");

        act(() => {
            userEvent.click(button)
        });

        expect(h1).toHaveTextContent(APP_TITLE);
        expect(button).toHaveTextContent("Upload");
    })
})