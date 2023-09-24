import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { MAX_THUMBNAIL_KEYS } from '../utils/CONSTANTS';

export interface GetThumbnailsResponseType {
    isTruncated: boolean;
    continuationToken: string | null;
    thumbnails: string[];
} 

// Define a service using a base URL and expected endpoints
export const galleryApi = createApi({
  reducerPath: 'galleryApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_BUCKET_URL_THUMBNAILS}` }),
  endpoints: (builder) => ({
    getThumbnails: builder.query<GetThumbnailsResponseType, { token: string | null}>({
        query: (arg) => {
            console.log('arg', arg)
            const { token } = arg;

            if (token !== null) {
                return {
                    url: `?list-type=2&max-keys=${MAX_THUMBNAIL_KEYS}&continuation-token=${token}`,
                    responseHandler: (response) => response.text()
                }
            }

            return {
                url: `?list-type=2&max-keys=${MAX_THUMBNAIL_KEYS}`,
                responseHandler: (response) => response.text(),
            }
        },
        transformResponse: async (response: string) => {
            const parser = new DOMParser();
            const docThumbnails = parser.parseFromString(response, "application/xml");

            let isTruncated = false;
            let continuationToken = null;
            // Check for truncation
            const docIsTruncated = docThumbnails.querySelector('IsTruncated');

            if (docIsTruncated?.textContent) {
                if (docIsTruncated.textContent === 'true') {
                    isTruncated = true;
                    // Check for continuation token
                    const nextToken = docThumbnails.querySelector('NextContinuationToken');

                    if (nextToken?.textContent) {
                        continuationToken = encodeURIComponent(nextToken.textContent);
                    }
                } else {
                    isTruncated = false;
                    continuationToken = null;
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

            return {
                isTruncated,
                continuationToken,
                thumbnails: thumbsArr
            }
        },
        serializeQueryArgs: ({ endpointName }) => endpointName,
        merge: (currentCache, newItems) => {
            console.log('currentCache', currentCache)
            console.log('newItems', newItems)

            currentCache.thumbnails.push(...newItems.thumbnails)
        },
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { 
    useGetThumbnailsQuery, 
    useLazyGetThumbnailsQuery 
} = galleryApi