import { access, rm } from "node:fs/promises";

import { afterAll, expect } from "vitest";

import { testConfig } from "../../../tests/test-config.js";
import { readAssetImage } from "../../../tests/utils/read-asset-image.js";
import { createServer } from "../../server.js";

const folderPath = "test-folder";

describe("POST /upload controller test", async () => {
	const fastify = await createServer();

	afterAll(() => fastify.close());
	afterAll(() => rm(`${testConfig.IMAGE_DIR}/${folderPath}/`, { recursive: true }));

	it("should return error if uploads no file", async () => {
		const formData = new FormData();
		formData.append("folder", folderPath);

		const response = await fastify.inject({
			method: "POST",
			url: "/upload",
			payload: formData,
			headers: {
				"x-api-key": testConfig.API_KEY,
			},
		});

		expect(response.statusCode).toBe(400);
		expect(response.json().error).toBe("Bad Request");
		expect(response.json().message).toBe("File is required");
	});

	it("should return error if uploads no directory", async () => {
		const formData = new FormData();

		const assetFile = readAssetImage("cat.jpg");
		formData.append("file", assetFile);

		const response = await fastify.inject({
			method: "POST",
			url: "/upload",
			payload: formData,
			headers: {
				"x-api-key": testConfig.API_KEY,
			},
		});

		expect(response.statusCode).toBe(400);
		expect(response.json().error).toBe("Bad Request");
		expect(response.json().message).toBe("Invalid folder");
	});

	it("should return error if uploads invalid file type", async () => {
		const formData = new FormData();
		const assetFile = readAssetImage("sunflowers.avif");
		formData.append("file", assetFile);
		formData.append("folder", folderPath);

		const response = await fastify.inject({
			method: "POST",
			url: "/upload",
			payload: formData,
			headers: {
				"x-api-key": testConfig.API_KEY,
			},
		});

		expect(response.statusCode).toBe(400);
		expect(response.json().error).toBe("Bad Request");
		expect(response.json().message).toBe("Invalid file type");
	});

	it("should return error if uploads invalid directory", async () => {
		const formData = new FormData();
		const assetFile = readAssetImage("doggy.png");
		formData.append("file", assetFile);
		formData.append("folder", "../../");

		const response = await fastify.inject({
			method: "POST",
			url: "/upload",
			payload: formData,
			headers: {
				"x-api-key": testConfig.API_KEY,
			},
		});

		expect(response.statusCode).toBe(400);
		expect(response.json().error).toBe("Bad Request");
		expect(response.json().message).toBe("Invalid folder");
	});

	it("should upload image to folder", async () => {
		const formData = new FormData();
		const assetFile = readAssetImage("doggy.png");
		formData.append("file", assetFile);
		formData.append("folder", folderPath);

		const response = await fastify.inject({
			method: "POST",
			url: "/upload",
			payload: formData,
			headers: {
				"x-api-key": testConfig.API_KEY,
			},
		});

		const responseData = response.json();
		expect(response.statusCode).toBe(200);
		expect(responseData.status).toBe("success");
		expect(responseData.message).toBe("File uploaded successfully");

		expect(
			access(`${testConfig.IMAGE_DIR}/${folderPath}/${responseData.data.fileName}`),
		).resolves.toBe(undefined);
	});
});
