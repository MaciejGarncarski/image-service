import { testConfig } from "./test-config.js";

vi.stubEnv("PORT", testConfig.PORT);
vi.stubEnv("API_KEY", testConfig.API_KEY);
vi.stubEnv("IMAGE_DIR", testConfig.IMAGE_DIR);
