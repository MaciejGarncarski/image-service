import { access, rm } from "node:fs/promises";

import { afterAll, expect } from "vitest";

import { testConfig } from "../../../tests/test-config.js";
import { readAssetImage } from "../../../tests/utils/read-asset-image.js";
import { MAX_FOLDER_SIZE } from "../../config/config.js";
import { createServer } from "../../server.js";

const folderPath = "test-folder";

describe("POST /upload controller test", async () => {
	const fastify = await createServer();

	afterAll(() => fastify.close());
	// Delete upload folder after all tests
	afterAll(() => rm(`${testConfig.IMAGE_DIR}`, { recursive: true }));

	it("should error if uploads no file", async () => {
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

	it("should error if uploads no directory", async () => {
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

	it("should error if uploads invalid file type", async () => {
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

	it("should upload image to correct folder", async () => {
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
		expect(responseData.message).toBe("File uploaded successfully");

		expect(
			access(`${testConfig.IMAGE_DIR}/${folderPath}/${responseData.data.fileName}`),
		).resolves.toBe(undefined);
	});

	it("should error if uploads more than MAX_FOLDER_SIZE", async () => {
		const formData = new FormData();
		const assetFile = readAssetImage("doggy.png");
		formData.append("file", assetFile);
		formData.append("folder", folderPath + "/limit");

		for (let i = 0; i <= MAX_FOLDER_SIZE + 1; i++) {
			await fastify.inject({
				method: "POST",
				url: "/upload",
				payload: formData,
				headers: {
					"x-api-key": testConfig.API_KEY,
				},
			});
		}

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
		expect(response.json().message).toBe("Folder is full");
	});

	describe("Path traversal", () => {
		it("should error if folder starts with '/'", async () => {
			const formData = new FormData();
			const assetFile = readAssetImage("doggy.png");
			formData.append("file", assetFile);
			formData.append("folder", "/home");

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

		it("should error if folder starts with '../' ", async () => {
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

		it("should error if folder contains '..'", async () => {
			const formData = new FormData();
			const assetFile = readAssetImage("doggy.png");
			formData.append("file", assetFile);
			formData.append("folder", `${folderPath}../test`);

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
	});
});
