import React, { useEffect, useRef } from 'react';
import { useGetThumbnailsQuery, useLazyGetThumbnailsQuery } from '../redux/galleryApi';
import { useAppSelector } from "../redux/hooks";
import { gallerySelector } from "../redux/gallerySlice";

import Thumbnail from './Thumbnail';
import Loader from './Loader';

import { GalleryStyles } from '../styles/GalleryStyles';

const Gallery = () => {
    const galleryState = useAppSelector(gallerySelector);

    const { data, isLoading } = useGetThumbnailsQuery({ token: null });

    // console.log('RTK Data', data)

    const [trigger, result] = useLazyGetThumbnailsQuery();

    // console.log('result', result)

    const isLoadingRef = useRef(true);
    const continuationTokenRef = useRef<string | null>(null)
    const observerTarget = useRef(null);
    const loadMoreBtn = useRef(null);

    isLoadingRef.current = isLoading;
    continuationTokenRef.current = galleryState.continuationToken;
    
    function isElementInViewport(el: HTMLElement) {
        var rect = el.getBoundingClientRect();
    
        return rect.bottom > 0 &&
            rect.right > 0 &&
            rect.left < (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */ &&
            rect.top < (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */;
    }


    // Only trigger scroll after DOMContentLoaded and not currently loading anything
    useEffect(() => {
        const observerUseEffect = observerTarget.current;
        
        const observer = new IntersectionObserver(
            entries => {
                if (loadMoreBtn.current !== null 
                    && !isElementInViewport(loadMoreBtn.current) 
                    && entries[0].isIntersecting
                    ) {
                        if (!isLoadingRef.current && document.readyState === 'complete') {
                            trigger({ token: continuationTokenRef.current })
                        }
                }
            },
            { threshold: 1 }
        );
      
        if (observerUseEffect) {
            observer.observe(observerUseEffect);
        }
      
        return () => {
            if (observerUseEffect) {
                observer.unobserve(observerUseEffect);
            }
        };
    }, [observerTarget, trigger]);


    return (
        <GalleryStyles>
            <h2>Gallery</h2>

            <ul>
                {
                    data?.thumbnails && data.thumbnails.length > 0 && data.thumbnails.map((thumbnail) => 
                        <Thumbnail 
                            key={thumbnail}
                            filename={thumbnail} 
                        />
                    )
                }
            </ul>
        
            {
                isLoading && 
                <Loader />
            }

            <div data-testid='observer-target' ref={observerTarget}></div>

            {
                !isLoading && galleryState?.isTruncated &&
                <div className='button-wrapper'>
                    <button 
                        data-testid='load-more'
                        className='load-more'
                        onClick={() => trigger({token: galleryState.continuationToken})}
                        ref={loadMoreBtn}
                    >Load More</button>
                </div>
            }
        </GalleryStyles>
    )
}

export default Gallery;