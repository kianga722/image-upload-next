import React from 'react';
import 'whatwg-fetch';
import { MAX_THUMBNAIL_KEYS } from '../utils/CONSTANTS';
import Gallery from '../components/Gallery';
import ImageModal from '../components/ImageModal';

// We're using our own custom render function and not RTL's render.
import { renderWithProviders } from './test-utils';

import { screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { server } from '../mocks/server.js'


beforeAll(() => server.listen())
// if you need to add a handler after calling setupServer for some specific test
// this will remove that handler for the rest of them
// (which is important for test isolation):
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Testing Gallery", () => {
    const observerMap = new Map();
    const instanceMap = new Map();

    function intersect(element: Element, isIntersecting: boolean) {
        const cb = observerMap.get(element);
        if (cb) {
            cb([
                {
                    isIntersecting,
                    target: element,
                    intersectionRatio: isIntersecting ? 1 : -1,
                },
            ]);
        }
    }
      
    function getObserverOf(element: Element): IntersectionObserver {
        return instanceMap.get(element);
    }

    // Have to mock both Intersection Observer and AWS S3 API
    beforeEach(
        () => {
            // @ts-ignore
            global.IntersectionObserver = jest.fn((cb, options = {}) => {
                const instance = {
                  thresholds: Array.isArray(options.threshold)
                    ? options.threshold
                    : [options.threshold],
                  root: options.root,
                  rootMargin: options.rootMargin,
                  observe: jest.fn((element: Element) => {
                    instanceMap.set(element, instance);
                    observerMap.set(element, cb);
                  }),
                  unobserve: jest.fn((element: Element) => {
                    instanceMap.delete(element);
                    observerMap.delete(element);
                  }),
                  disconnect: jest.fn(),
                };
                return instance;
            })
        }
    )

    afterEach(() => {
        // @ts-ignore
        global.IntersectionObserver.mockReset();
        instanceMap.clear();
        observerMap.clear();
    });

    test("Should fetch data from AWS bucket and render Gallery", async () => {
        renderWithProviders(<Gallery />)

        await waitFor(() => {
            expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
        })

        // Wait for page to update with query text
        const imgs = await screen.findAllByRole('img');
        expect(imgs).toHaveLength(MAX_THUMBNAIL_KEYS);
    })

    test("Should display more data when user scrolls down and hits the Intersection Observer Target", async () => {
        renderWithProviders(<Gallery />)

        await waitFor(() => {
            expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
        })

        const imgs = await screen.findAllByRole('img');
        expect(imgs).toHaveLength(MAX_THUMBNAIL_KEYS);

        const observerTarget = screen.getByTestId('observer-target');

        act(() => {
            intersect(observerTarget, true);
        });

        await waitFor(async () => {
            const imgsAfter = await screen.findAllByRole('img');
            expect(imgsAfter).toHaveLength(2*MAX_THUMBNAIL_KEYS);   
        })
    })

    test("Should display more data when user hits the Load More Button", async () => {
        renderWithProviders(<Gallery />)

        await waitFor(() => {
            expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
        })

        const imgs = await screen.findAllByRole('img');
        expect(imgs).toHaveLength(MAX_THUMBNAIL_KEYS);

        const button = screen.getByTestId("load-more");
        act(() => {
            userEvent.click(button)

        })

        await waitFor(async () => {
            const imgsAfter = await screen.findAllByRole('img');
            expect(imgsAfter).toHaveLength(2*MAX_THUMBNAIL_KEYS);   
        })     
    })


    test("Should render Image Modal with full image when thumbnail of same image is clicked", async () => {
        renderWithProviders(<><Gallery /> <ImageModal /></>)

        await waitFor(() => {
            expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
        })

        const imgs = await screen.findAllByRole('img');
        expect(imgs).toHaveLength(MAX_THUMBNAIL_KEYS);
        
        act(() => {
            userEvent.click(imgs[3]);
        })

        const clickedImgSrc = (imgs[3] as HTMLImageElement).src

        expect(clickedImgSrc).toContain('resized')

        const fullImageName = clickedImgSrc.replace('resized-', '').split('amazonaws.com')[1];

        const dialogImg: HTMLImageElement = await screen.findByTestId('dialog-img');
        const dialogImgName = dialogImg.src.split('amazonaws.com')[1];
       
        expect(dialogImgName).toBe(fullImageName)
    })
})