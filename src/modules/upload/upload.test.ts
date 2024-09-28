import assert from "node:assert";
import { after, describe, it } from "node:test";

import { createServer } from "../../server.js";

describe("POST /upload controller test", async () => {
	const fastify = await createServer();

	after(() => fastify.close());

	await it("should return error if uploads no file", async () => {
		const formData = new FormData();
		formData.append("dirname", "test");

		const response = await fastify.inject({
			method: "POST",
			url: "/upload",
			payload: formData,
			headers: {
				"x-api-key": "44b0866d-1b54-41d4-8b22-8ea857760797",
			},
		});

		assert.strictEqual(response.statusCode, 400);
		assert.strictEqual(response.json().error, "Bad Request");
		assert.strictEqual(response.json().message, "File is required");
	});

	await it("should return error if uploads no directory", async () => {
		const formData = new FormData();
		formData.append("file", new File(["test"], "test.jpg"));

		const response = await fastify.inject({
			method: "POST",
			url: "/upload",
			payload: formData,
			headers: {
				"x-api-key": "44b0866d-1b54-41d4-8b22-8ea857760797",
			},
		});

		assert.strictEqual(response.statusCode, 400);
		assert.strictEqual(response.json().error, "Bad Request");
		assert.strictEqual(response.json().message, "Invalid dirname");
	});

	await it("should return error if uploads invalid file type", async () => {
		const formData = new FormData();
		formData.append("file", new File(["test"], "test.avif"));
		formData.append("dirname", "test");

		const response = await fastify.inject({
			method: "POST",
			url: "/upload",
			payload: formData,
			headers: {
				"x-api-key": "44b0866d-1b54-41d4-8b22-8ea857760797",
			},
		});

		assert.strictEqual(response.statusCode, 400);
		assert.strictEqual(response.json().error, "Bad Request");
		assert.strictEqual(response.json().message, "Invalid file type");
	});

	await it("should return error if uploads invalid directory", async () => {
		const formData = new FormData();
		formData.append("file", new File(["test"], "test.jpg"));
		formData.append("dirname", "../../");

		const response = await fastify.inject({
			method: "POST",
			url: "/upload",
			payload: formData,
			headers: {
				"x-api-key": "44b0866d-1b54-41d4-8b22-8ea857760797",
			},
		});

		assert.strictEqual(response.statusCode, 400);
		assert.strictEqual(response.json().error, "Bad Request");
		assert.strictEqual(response.json().message, "Invalid dirname");
	});
});
