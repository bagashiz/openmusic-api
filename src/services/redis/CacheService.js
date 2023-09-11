const redis = require('redis');

/**
 * CacheService is a class that provides methods for caching data using Redis.
 *
 * @class
 */
class CacheService {
	/**
	 * Creates a new instance of CacheService and initializes the Redis client.
	 *
	 * @constructor
	 */
	constructor() {
		/**
		 * The Redis client instance.
		 * @private
		 * @type {RedisClient}
		 */
		this._client = redis.createClient({
			socket: {
				host: process.env.REDIS_SERVER,
			},
		});

		// Handle Redis client errors.
		this._client.on('error', (error) => {
			console.error(error);
		});

		// Connect to the Redis server.
		this._client.connect();
	}

	/**
	 * Stores data in the Redis cache with an optional expiration time.
	 *
	 * @param {string} key - The key under which the data will be stored.
	 * @param {string} value - The data to be stored.
	 * @param {number} [expirationInSecond=3600] - The expiration time in seconds (default is 3600 seconds).
	 * @returns {Promise<void>} A promise that resolves when the data is successfully stored.
	 */
	async set(key, value, expirationInSecond = 3600) {
		await this._client.set(key, value, {
			EX: expirationInSecond,
		});
	}

	/**
	 * Retrieves data from the Redis cache.
	 *
	 * @param {string} key - The key under which the data is stored.
	 * @returns {Promise<string>} A promise that resolves to the retrieved data.
	 * @throws {Error} Throws an error if the requested data is not found in the cache.
	 */
	async get(key) {
		const result = await this._client.get(key);
		if (result === null) {
			throw new Error('Cache not found');
		}
		return result;
	}

	/**
	 * Deletes data from the Redis cache.
	 *
	 * @param {string} key - The key of the data to be deleted.
	 * @returns {Promise<number>} A promise that resolves to the number of keys deleted (0 or 1).
	 */
	delete(key) {
		return this._client.del(key);
	}
}

module.exports = CacheService;
