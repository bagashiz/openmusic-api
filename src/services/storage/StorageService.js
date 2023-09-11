const fs = require('fs');

/**
 * StorageService is a class that provides methods for writing files to storage.
 *
 * @class
 */
class StorageService {
	/**
	 * Creates a new instance of StorageService.
	 *
	 * @constructor
	 * @param {string} folder - The folder path of the storage.
	 */
	constructor(folder) {
		/**
		 * The folder path of the storage.
		 * @private
		 * @type {string}
		 */
		this._folder = folder;

		if (!fs.existsSync(folder)) {
			fs.mkdirSync(folder, { recursive: true });
		}
	}

	/**
	 * Writes a file to the storage.
	 *
	 * @param {Readable} file - A readable stream containing the file data to be written.
	 * @param {Object} meta - Metadata associated with the file.
	 * @returns {Promise<string>} A promise that resolves to the filename of the stored file.
	 * @throws {Error} Throws an error if there is an issue during the file write operation.
	 */
	async writeFile(file, meta) {
		const filename = `${Date.now()}-${meta.filename}`;
		const path = `${this._folder}/${filename}`;

		const fileStream = fs.createWriteStream(path);

		return new Promise((resolve, reject) => {
			fileStream.on('error', (error) => {
				reject(error);
			});

			file.pipe(fileStream);

			file.on('end', () => {
				resolve(filename);
			});
		});
	}
}

module.exports = StorageService;
