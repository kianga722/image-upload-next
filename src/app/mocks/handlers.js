// server-handlers.js
// this is put into here so I can share these same handlers between my tests
// as well as my development in the browser. Pretty sweet!
import { rest } from 'msw' // msw supports graphql too!
import { galleryXML } from './responses/galleryXML';

let reqUrl = `${process.env.NEXT_PUBLIC_BUCKET_URL_THUMBNAILS}`;
let uploadUrl = `${process.env.NEXT_PUBLIC_UPLOAD_ENDPOINT}`;

const handlers = [
    rest.get(reqUrl, async (req, res, ctx) => {
        if (req.url.searchParams.get('continuation-token') !== null) {
            return res(
                ctx.xml(galleryXML[1])
            );
        }

        return res(
            ctx.xml(galleryXML[0])
        );
    }),
    rest.post(uploadUrl, (req, res, ctx) => {
        return res(
            ctx.json(
                {
                "url":"https://presignedUrl.amazonaws.com","fields": {
                    "bucket":"upload-bucket","X-Amz-Signature":"test"}
                }
            )
        );
    }),
    rest.post("https://presignedUrl.amazonaws.com", (req, res, ctx) => {
        return res(
            ctx.status(202, 'Mocked status')
        )
    })
]

export { handlers }
