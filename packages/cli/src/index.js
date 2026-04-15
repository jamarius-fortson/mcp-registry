#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("CLI Starting...");
const commander_1 = require("commander");
const publish_1 = require("./commands/publish");
const install_1 = require("./commands/install");
const chalk_1 = __importDefault(require("chalk"));
const program = new commander_1.Command();
program
    .name("mcpx")
    .description("MCP Registry CLI - Search, Install, and Publish MCP servers")
    .version("0.1.0");
program
    .command("publish")
    .description("Publish an MCP server to the registry")
    .argument("[path]", "Path to the directory containing mcp.json", ".")
    .action(publish_1.publish);
program
    .command("install")
    .description("Install an MCP server from the registry")
    .argument("<name>", "Name of the server (e.g., @scope/name)")
    .option("-v, --version <version>", "Specific version to install")
    .action(install_1.install);
program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
//# sourceMappingURL=index.js.map