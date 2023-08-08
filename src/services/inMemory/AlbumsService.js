const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * AlbumsService is a class that will be used to handle all of the CRUD operations on albums data
 */
class AlbumsService {
    constructor() {
        this._albums = [];
    }

    /**
     * addAlbum is a method that will be used to handle the POST request to add a album
     */
    addAlbum({ title, body, tags }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const newAlbum = {
            title,
            tags,
            body,
            id,
            createdAt,
            updatedAt,
        };

        this._albums.push(newAlbum);

        const isSuccess = this._albums.filter((album) => album.id === id).length > 0;

        if (!isSuccess) {
            throw new InvariantError('Album gagal ditambahkan');
        }

        return id;
    }

    /**
     * getAlbums is a method that will be used to handle the GET request to get all albums
     */
    getAlbums() {
        return this._albums;
    }

    /**
     * getAlbumById is a method that will be used to handle the GET request
     */
    getAlbumById(id) {
        const album = this._albums.filter((n) => n.id === id)[0];
        if (!album) {
            throw new NotFoundError('Album tidak ditemukan');
        }
        return album;
    }

    /**
     *  editAlbumById is a method that will be used to handle the PUT request
     */
    editAlbumById(id, { title, body, tags }) {
        const index = this._albums.findIndex((album) => album.id === id);

        if (index === -1) {
            throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
        }

        const updatedAt = new Date().toISOString();

        this._albums[index] = {
            ...this._albums[index],
            title,
            tags,
            body,
            updatedAt,
        };
    }

    /**
     * deleteAlbumById is a method that will be used to handle the DELETE request
     */
    deleteAlbumById(id) {
        const index = this._albums.findIndex((album) => album.id === id);
        if (index === -1) {
            throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
        }
        this._albums.splice(index, 1);
    }
}

module.exports = AlbumsService;
