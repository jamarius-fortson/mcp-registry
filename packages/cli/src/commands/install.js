"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = install;
const axios_1 = __importDefault(require("axios"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const API_BASE_URL = process.env.MCP_REGISTRY_URL || "http://localhost:8000";
async function install(name, options) {
    const spinner = (0, ora_1.default)(`Fetching ${name}...`).start();
    try {
        // Standardize name for URL
        const sanitizedName = name.startsWith("@") ? name.substring(1) : name;
        const version = options.version || "latest"; // Note: API needs a specific version for now or 'latest' resolver
        // For Phase 2, we assume the user provides a version or we fetch a specific one
        const targetVersion = options.version || "1.0.0";
        const url = `${API_BASE_URL}/v1/servers/${sanitizedName}/${targetVersion}`;
        const response = await axios_1.default.get(url);
        const { metadata } = response.data;
        spinner.succeed(chalk_1.default.green(`Found ${name}@${metadata.version}`));
        console.log(chalk_1.default.gray("\nManifest Details:"));
        console.log(chalk_1.default.white(`  Runtime: ${metadata.runtime.type}`));
        console.log(chalk_1.default.white(`  Package: ${metadata.runtime.package.name}@${metadata.runtime.package.version}`));
        console.log(chalk_1.default.yellow("\n[Phase 2 Stub] If this were Phase 3:"));
        console.log(chalk_1.default.cyan(`  - Running: npm install -g ${metadata.runtime.package.name}`));
        console.log(chalk_1.default.cyan(`  - Linking: to Claude Desktop config...`));
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            spinner.fail(chalk_1.default.red(`Server not found or API error: ${error.response?.data?.detail || error.message}`));
        }
        else {
            spinner.fail(chalk_1.default.red(`Unexpected error: ${error.message}`));
        }
    }
}
//# sourceMappingURL=install.js.map