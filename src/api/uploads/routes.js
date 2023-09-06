const path = require('path');

/**
 * routes handles the routes for the uploads API.
 */
const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums/{id}/covers',
        handler: handler.postUploadAlbumCoverHandler,
        options: {
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
                output: 'stream',
                maxBytes: 512 * 1000, // 512 kB
            },
        },
    },
    {
        method: 'GET',
        path: '/albums/{id}/{param*}',
        handler: {
            directory: {
                path: path.resolve(__dirname, 'file'),
            },
        },
    },
];

module.exports = routes;
