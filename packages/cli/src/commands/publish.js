"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publish = publish;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const manifest_1 = require("../../schema/manifest");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const API_BASE_URL = process.env.MCP_REGISTRY_URL || "http://localhost:8000";
async function publish(projectPath) {
    const spinner = (0, ora_1.default)("Reading manifest...").start();
    const manifestPath = path_1.default.resolve(projectPath, "mcp.json");
    if (!fs_1.default.existsSync(manifestPath)) {
        spinner.fail(chalk_1.default.red(`Error: mcp.json not found at ${manifestPath}`));
        process.exit(1);
    }
    try {
        const rawData = fs_1.default.readFileSync(manifestPath, "utf-8");
        const manifestJson = JSON.parse(rawData);
        spinner.text = "Validating manifest...";
        const manifest = manifest_1.ManifestSchema.parse(manifestJson);
        spinner.text = `Publishing ${manifest.name}@${manifest.version} to ${API_BASE_URL}...`;
        const response = await axios_1.default.post(`${API_BASE_URL}/v1/publish`, manifest);
        spinner.succeed(chalk_1.default.green(`Successfully published ${manifest.name}@${manifest.version}!`));
        console.log(chalk_1.default.blue(`View at: ${API_BASE_URL}/servers/${manifest.name}`));
    }
    catch (error) {
        if (error.name === "ZodError") {
            spinner.fail(chalk_1.default.red("Manifest validation failed:"));
            error.errors.forEach((e) => {
                console.log(chalk_1.default.yellow(`  - ${e.path.join(".")}: ${e.message}`));
            });
        }
        else if (axios_1.default.isAxiosError(error)) {
            spinner.fail(chalk_1.default.red(`API Error: ${error.response?.data?.detail || error.message}`));
        }
        else {
            spinner.fail(chalk_1.default.red(`Unexpected error: ${error.message}`));
        }
        process.exit(1);
    }
}
//# sourceMappingURL=publish.js.map