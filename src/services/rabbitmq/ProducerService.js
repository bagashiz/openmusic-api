const amqp = require('amqplib');

/**
 * ProducerService is a service for sending messages to a message queue.
 *
 * @namespace
 */
const ProducerService = {
	/**
	 * Sends a message to the specified queue.
	 *
	 * @param {string} queue - The name of the queue to send the message to.
	 * @param {string} message - The message to be sent to the queue.
	 * @returns {Promise<void>} A Promise that resolves when the message is sent.
	 * @throws {Error} If there is an issue with the RabbitMQ connection or message sending.
	 */
	sendMessage: async (queue, message) => {
		const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
		const channel = await connection.createChannel();
		await channel.assertQueue(queue, {
			durable: true,
		});

		await channel.sendToQueue(queue, Buffer.from(message));

		setTimeout(() => {
			connection.close();
		}, 1000);
	},
};

module.exports = ProducerService;
