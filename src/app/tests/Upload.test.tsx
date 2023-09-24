import React from 'react';
import 'whatwg-fetch'

import { MAX_FILE_SIZE_BYTES } from '../utils/CONSTANTS';
import UploadModal from '../components/UploadModal';

import UploadContextProvider from '../contexts/UploadContext';

import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { server } from '../mocks/server.js'

beforeAll(() => server.listen())
// if you need to add a handler after calling setupServer for some specific test
// this will remove that handler for the rest of them
// (which is important for test isolation):
afterEach(() => server.resetHandlers())
afterAll(() => server.close())


describe("Testing Upload", () => {
    let fileGood: File;
    let fileGood2: File;
    let fileWrongType: File;

    // Have to mock FormData
    function FormDataMock() {
        const obj = { hello: "world" };
        const blob = new Blob([JSON.stringify(obj, null, 2)], {
            type: "application/json",
        });
        // @ts-ignore
        blob.append = jest.fn();
        return blob;
    }

    beforeEach(
        () => {
            // @ts-ignore
            global.URL.createObjectURL = jest.fn(),
            // @ts-ignore
            global.FormData = FormDataMock,
            fileGood = new File(["(⌐□_□)"], "fileGood.png", { type: "image/png" }),
            fileGood2 = new File(["test"], "fileTest.jpg", { type: "image/png" }),
            fileWrongType = new File(["txt"], "test.txt", { type: "text" })
        }
    )

    test("Modal should allow file upload and show success message", async () => {
        render(
            <UploadContextProvider initialModalOpen={true}>
              <UploadModal />
            </UploadContextProvider>
        );

        expect(screen.getByText(/^Upload/)).toHaveTextContent('Upload Image');
        expect(screen.queryByTestId('uploadpreview')).not.toBeInTheDocument();
        expect(screen.queryByTestId('uploadsubmit')).not.toBeInTheDocument();

        const input = screen.getByTestId('input') as HTMLInputElement ;

        // Browsing and previewing file
        act(() => {
            userEvent.upload(input, fileGood);
        })
       
        // Non-null assertion operator '!' removes 'null | undefined' from the type
        // StrictEqual doesnt seem to work for File types? Always returns true for any new File()
        // expect(input.files![0]).toStrictEqual(fileGood);
        expect(input.files![0].name).toStrictEqual(fileGood.name);

        const submit = screen.getByTestId('uploadsubmit')
        expect(screen.getByTestId('uploadpreview')).toBeInTheDocument();
        expect(submit).toBeInTheDocument();

        // Submitting upload
        act(() => {
            userEvent.click(submit);
        })

        await waitFor(() => {
            expect(screen.queryByTestId('uploadloader')).not.toBeInTheDocument();
        })

        // Success message
        expect(screen.queryByTestId('successmessage')).toBeInTheDocument();

        // Clicking confirm should reset the upload modal
        act(() => {
            userEvent.click(screen.getByTestId('successconfirm'));
        })

        expect(screen.getByText(/^Upload/)).toHaveTextContent('Upload Image');
        expect(screen.queryByTestId('uploadpreview')).not.toBeInTheDocument();
        expect(screen.queryByTestId('uploadsubmit')).not.toBeInTheDocument();
    })

    test("Should be able to change file inputs before submitting", async () => {
        render(
            <UploadContextProvider initialModalOpen={true}>
              <UploadModal />
            </UploadContextProvider>
        );

        expect(screen.getByText(/^Upload/)).toHaveTextContent('Upload Image');
        expect(screen.queryByTestId('uploadpreview')).not.toBeInTheDocument();
        expect(screen.queryByTestId('uploadsubmit')).not.toBeInTheDocument();

        const input = screen.getByTestId('input') as HTMLInputElement ;

        // Browsing and previewing file
        act(() => {
            userEvent.upload(input, fileGood);
        })
       
        expect(input.files![0].name).toStrictEqual(fileGood.name);

        const submit = screen.getByTestId('uploadsubmit')
        expect(screen.getByTestId('uploadpreview')).toBeInTheDocument();
        expect(submit).toBeInTheDocument();

        // Change file input
        act(() => {
            userEvent.upload(input, fileGood2);
        })
        
        expect(input.files![0].name).toStrictEqual(fileGood2.name);
    })

    test("Should not allow uploads of files that are not an image and display proper error message", async () => {
        render(
            <UploadContextProvider initialModalOpen={true}>
              <UploadModal />
            </UploadContextProvider>
        );

        expect(screen.getByText(/^Upload/)).toHaveTextContent('Upload Image');
        expect(screen.queryByTestId('uploadpreview')).not.toBeInTheDocument();
        expect(screen.queryByTestId('uploadsubmit')).not.toBeInTheDocument();
        expect(screen.queryByText('Selected file is not an image')).not.toBeInTheDocument();

        const input = screen.getByTestId('input') as HTMLInputElement;

        // Choose file with wrong image type
        act(() => {
            userEvent.upload(input, fileWrongType);
        })

        expect(screen.queryByText('Selected file is not an image')).toBeInTheDocument();
    })

    test("Should not allow uploads of files that are too large and display proper error message", async () => {
        render(
            <UploadContextProvider initialModalOpen={true}>
              <UploadModal />
            </UploadContextProvider>
        );

        expect(screen.getByText(/^Upload/)).toHaveTextContent('Upload Image');
        expect(screen.queryByTestId('uploadpreview')).not.toBeInTheDocument();
        expect(screen.queryByTestId('uploadsubmit')).not.toBeInTheDocument();
        expect(screen.queryByText(`File size is too large. Maximum allowed size is 10 MB`)).not.toBeInTheDocument();

        const input = screen.getByTestId('input') as HTMLInputElement;

        // Make file size too large
        Object.defineProperty(fileGood, 'size', { value: MAX_FILE_SIZE_BYTES+1 })

        act(() => {
            userEvent.upload(input, fileGood);
        })

        expect(screen.queryByText(`File size is too large. Maximum allowed size is 10 MB`)).toBeInTheDocument();
    })
})