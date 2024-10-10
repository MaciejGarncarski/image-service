import { access, rm } from "node:fs/promises";

import { afterAll, describe, expect } from "vitest";

import { testConfig } from "../../../__tests__/test-config.js";
import { makeUploadRequest } from "../../../__tests__/utils/make-upload-request.js";
import { MAX_FOLDER_SIZE } from "../../config/config.js";
import { createServer } from "../../server.js";

const folderPath = "test-folder";

describe("POST /upload controller test", async () => {
	const fastify = await createServer();

	afterAll(() => fastify.close());
	// Delete upload folder after all __tests__
	afterAll(() => rm(`${testConfig.IMAGE_DIR}`, { recursive: true }));

	it("should error if uploads no file", async () => {
		const response = await makeUploadRequest({ fastify, folder: folderPath });

		expect(response.statusCode).toBe(400);
		expect(response.json().error).toBe("Bad Request");
		expect(response.json().message).toBe("File is required");
	});

	it("should error if uploads no directory", async () => {
		const response = await makeUploadRequest({ fastify, testFile: "cat.jpg" });

		expect(response.statusCode).toBe(400);
		expect(response.json().error).toBe("Bad Request");
		expect(response.json().message).toBe("Invalid folder");
	});

	it("should upload image to correct folder", async () => {
		const response = await makeUploadRequest({
			fastify,
			folder: folderPath,
			testFile: "sample.avif",
		});

		const responseData = response.json();
		expect(response.statusCode).toBe(200);
		expect(responseData.message).toBe("File uploaded successfully");

		expect(
			access(`${testConfig.IMAGE_DIR}/${folderPath}/${responseData.data.fileName}`),
		).resolves.toBe(undefined);
	});

	it("should error if upload file bigger than MAX_FILE_SIZE", async () => {
		const response = await makeUploadRequest({
			fastify,
			testFile: "big.jpg",
			folder: folderPath,
		});

		expect(response.statusCode).toBe(413);
		expect(response.json().error).toBe("Payload Too Large");
		expect(response.json().message).toBe("request file too large");
	});

	it("should error if uploads more than MAX_FOLDER_SIZE", async () => {
		for (let i = 0; i <= MAX_FOLDER_SIZE + 1; i++) {
			await makeUploadRequest({
				fastify,
				testFile: "doggy.png",
				folder: folderPath + "/limit",
			});
		}

		const response = await makeUploadRequest({
			fastify,
			testFile: "doggy.png",
			folder: folderPath + "/limit",
		});

		expect(response.statusCode).toBe(400);
		expect(response.json().error).toBe("Bad Request");
		expect(response.json().message).toBe("Folder is full");
	});

	describe("File types", () => {
		it("should error if uploads unsupported file type", async () => {
			const response = await makeUploadRequest({
				fastify,
				folder: folderPath,
				testFile: "unsupported.jxl",
			});

			expect(response.statusCode).toBe(400);
			expect(response.json().error).toBe("Bad Request");
			expect(response.json().message).toBe("Invalid file type");
		});

		it("should upload .jpg", async () => {
			const response = await makeUploadRequest({
				fastify,
				testFile: "cat.jpg",
				folder: folderPath,
			});

			const responseData = response.json();
			expect(response.statusCode).toBe(200);
			expect(responseData.message).toBe("File uploaded successfully");
		});

		it("should upload .png", async () => {
			const response = await makeUploadRequest({
				fastify,
				testFile: "doggy.png",
				folder: folderPath,
			});

			const responseData = response.json();
			expect(response.statusCode).toBe(200);
			expect(responseData.message).toBe("File uploaded successfully");
		});

		it("should upload .webp", async () => {
			const response = await makeUploadRequest({
				fastify,
				testFile: "cell_animation.webp",
				folder: folderPath,
			});

			const responseData = response.json();
			expect(response.statusCode).toBe(200);
			expect(responseData.message).toBe("File uploaded successfully");
		});

		it("should upload .gif", async () => {
			const response = await makeUploadRequest({
				fastify,
				testFile: "croco.gif",
				folder: folderPath,
			});

			const responseData = response.json();
			expect(response.statusCode).toBe(200);
			expect(responseData.message).toBe("File uploaded successfully");
		});

		it("should upload .avif", async () => {
			const response = await makeUploadRequest({
				fastify,
				testFile: "sample.avif",
				folder: folderPath,
			});

			const responseData = response.json();
			expect(response.statusCode).toBe(200);
			expect(responseData.message).toBe("File uploaded successfully");
		});
	});

	describe("Path traversal", () => {
		it("should error if folder starts with '/'", async () => {
			const response = await makeUploadRequest({
				fastify,
				testFile: "doggy.png",
				folder: "/home",
			});

			expect(response.statusCode).toBe(400);
			expect(response.json().error).toBe("Bad Request");
			expect(response.json().message).toBe("Invalid folder");
		});

		it("should error if folder starts with '../' ", async () => {
			const response = await makeUploadRequest({
				fastify,
				testFile: "doggy.png",
				folder: "../../",
			});

			expect(response.statusCode).toBe(400);
			expect(response.json().error).toBe("Bad Request");
			expect(response.json().message).toBe("Invalid folder");
		});

		it("should error if folder contains '..'", async () => {
			const response = await makeUploadRequest({
				fastify,
				testFile: "doggy.png",
				folder: `${folderPath}../test`,
			});

			expect(response.statusCode).toBe(400);
			expect(response.json().error).toBe("Bad Request");
			expect(response.json().message).toBe("Invalid folder");
		});
	});
});
