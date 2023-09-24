import React, { useState, useEffect, useRef } from 'react';
import { MAX_THUMBNAIL_KEYS } from '../utils/CONSTANTS';

import Thumbnail from './Thumbnail';
import Loader from './Loader';

import { GalleryStyles } from '../styles/GalleryStyles';

const Gallery = () => {
    const [isLoading, setIsLoading] = useState(true);

    const [thumbnails, setThumbnails] = useState<string[]>([])
    const [isTruncated, setIsTruncated] = useState(true)
    const [continuationToken, setContinuationToken] = useState<string | null>(null)

    const isLoadingRef = useRef(false);
    const isTruncatedRef = useRef(true);
    const continuationTokenRef = useRef<string | null>(null);
    const observerTarget = useRef(null);
    const loadMoreBtn = useRef(null);
    
    const thumbnailsRef = useRef<string[]>([]);

    // Need to use refs because of useEffect closures not using the latest state
    isLoadingRef.current = isLoading;
    isTruncatedRef.current = isTruncated;
    continuationTokenRef.current = continuationToken;
    thumbnailsRef.current = thumbnails;
    
    async function getThumbnails(controller: AbortController | null) {
        if (!isTruncatedRef.current) {
            return;
        }

        setIsLoading(true);

        try {
            let reqUrl = `${process.env.NEXT_PUBLIC_BUCKET_URL_THUMBNAILS}?list-type=2&max-keys=${MAX_THUMBNAIL_KEYS}`;

            if (isTruncatedRef.current && continuationTokenRef.current !== null) {
                reqUrl += `&continuation-token=${continuationTokenRef.current}`
            }

            const response = await fetch(reqUrl, {
                method: "GET",
                signal: controller?.signal
            })

            const responseText = await response.text()

            const parser = new DOMParser();
            const docThumbnails = parser.parseFromString(responseText, "application/xml");

            // Check for truncation
            const docIsTruncated = docThumbnails.querySelector('IsTruncated');

            if (docIsTruncated?.textContent) {
                if (docIsTruncated.textContent === 'true') {
                    setIsTruncated(true)
                    // Check for continuation token
                    const nextToken = docThumbnails.querySelector('NextContinuationToken');

                    if (nextToken?.textContent) {
                        setContinuationToken(encodeURIComponent(nextToken.textContent));
                    }
                } else {
                    setIsTruncated(false)
                    setContinuationToken(null);
                }
            }

            // Get thumbnails
            const thumbs = docThumbnails.querySelectorAll('Key');

            const thumbsArr:string[] = [];
            for (let thumb of thumbs) {
                if (thumb.textContent) {
                    thumbsArr.push(thumb.textContent)
                }
            }

            setThumbnails(prevItems => [
                ...prevItems,
                ...thumbsArr
            ])

            controller = null;

        } catch (err) {
            console.log('error', err)
        } finally {
            setIsLoading(false);
        }
    }

    function isElementInViewport(el: HTMLElement) {
        var rect = el.getBoundingClientRect();
    
        return rect.bottom > 0 &&
            rect.right > 0 &&
            rect.left < (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */ &&
            rect.top < (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */;
    }

    // Get images on load
    useEffect(() => {
        console.log('getting thumbnails')
        let controller = new AbortController();
        getThumbnails(controller)

        return () => {
            console.log('controller abort', controller)
            controller?.abort()
            console.log('ABORTED')
        }
    }, []);

    // Only trigger scroll after DOMContentLoaded and not currently loading anything
    useEffect(() => {
        let controller = new AbortController();

        const observer = new IntersectionObserver(
            entries => {
                if (loadMoreBtn.current !== null 
                    && !isElementInViewport(loadMoreBtn.current) 
                    && entries[0].isIntersecting
                    ) {
                    if (!isLoadingRef.current && document.readyState === 'complete') {
                        getThumbnails(controller)
                    }
                }
            },
            { threshold: 1 }
        );
      
        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }
      
        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
            controller?.abort()
        };
    }, [observerTarget]);

    return (
        <GalleryStyles>
            <h2>Gallery</h2>

            <ul>
                {
                    thumbnails.length > 0 && thumbnails.map((thumbnail) => (
                        <Thumbnail 
                            key={thumbnail}
                            filename={thumbnail} 
                        />
                    ))
                }
            </ul>
        
            {
                isLoading && 
                <Loader />
            }

            <div data-testid='observer-target' ref={observerTarget}></div>

            {
                !isLoading && isTruncated &&
                <div className='button-wrapper'>
                    <button 
                        data-testid='load-more'
                        className='load-more'
                        onClick={() => getThumbnails(null)}
                        ref={loadMoreBtn}
                    >Load More</button>
                </div>
            }
        </GalleryStyles>
        
    )
}

export default Gallery;