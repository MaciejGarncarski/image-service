import { fastifySensible } from "@fastify/sensible";
import Fastify from "fastify";
import { afterAll } from "vitest";

import { testConfig } from "../../../__tests__/test-config.js";
import { checkApiKey } from "../check-api-key.js";

describe("API key middleware", () => {
	const fastify = Fastify();

	fastify.decorate("checkApiKey", checkApiKey);
	fastify.register(fastifySensible);

	fastify.get("/", {
		preHandler: [fastify.checkApiKey],
		handler: () => {
			return { message: "Hello world" };
		},
	});

	afterAll(() => fastify.close());

	it("should return unauthorized if no key provided", async () => {
		const fastifyResponse = await fastify.inject({
			method: "GET",
			url: "/",
		});

		const response = fastifyResponse.json();

		expect(response.statusCode).toBe(401);
		expect(response.error).toBe("Unauthorized");
		expect(response.message).toBe("No key provided");
	});

	it("should return unauthorized if invalid key provided", async () => {
		const fastifyResponse = await fastify.inject({
			method: "GET",
			url: "/",
			headers: {
				"x-api-key": "invalid-key",
			},
		});

		const response = fastifyResponse.json();

		expect(response.statusCode).toBe(401);
		expect(response.error).toBe("Unauthorized");
		expect(response.message).toBe("Invalid key provided");
	});

	it("should return hello world if valid key provided", async () => {
		const response = await fastify.inject({
			method: "GET",
			url: "/",
			headers: {
				"x-api-key": testConfig.API_KEY,
			},
		});

		expect(response.statusCode).toBe(200);
		expect(JSON.parse(response.payload).message).toBe("Hello world");
	});
});
