import { Multipart } from "@fastify/multipart";

import { testConfig } from "../../../../../__tests__/test-config.js";
import { parseFolderField } from "../parse-folder-field.js";

describe("Parse folder field", () => {
	it("should return undefined if no folder field is passed", () => {
		const field = parseFolderField(undefined);
		expect(field).toBe(undefined);
	});
	it("should return undefined if array is passed", () => {
		const field = parseFolderField([{ value: "test", type: "field" } as Multipart]);
		expect(field).toBe(undefined);
	});

	it("should return undefined if file is passed", () => {
		const field = parseFolderField({ type: "file" } as Multipart);
		expect(field).toBe(undefined);
	});

	it("should return undefined if not string value is passed", () => {
		const field = parseFolderField({ type: "field", value: 69 } as Multipart);
		expect(field).toBe(undefined);
	});

	it('should return undefined if includes ".."', () => {
		const field = parseFolderField({ type: "field", value: "../test" } as Multipart);
		expect(field).toBe(undefined);
	});

	it('should return undefined if starts with "/"', () => {
		const field = parseFolderField({ type: "field", value: "../test" } as Multipart);
		expect(field).toBe(undefined);
	});

	it("should return normalized folder", () => {
		const field = parseFolderField({ type: "field", value: "test" } as Multipart);
		expect(field).toBe(testConfig.IMAGE_DIR + "/test");
	});
});
