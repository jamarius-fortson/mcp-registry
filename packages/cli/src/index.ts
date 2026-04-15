#!/usr/bin/env node
import { Command } from "commander";
import { publish } from "./commands/publish";
import { install } from "./commands/install";
import { search } from "./commands/search";
import chalk from "chalk";

const program = new Command();

program
  .name("mcpx")
  .description("MCP Registry CLI - Search, Install, and Publish MCP servers")
  .version("0.1.0");

program
  .command("search")
  .description("Search for MCP servers in the registry")
  .argument("<query>", "Search query")
  .action(search);

program
  .command("publish")
  .description("Publish an MCP server to the registry")
  .argument("[path]", "Path to the directory containing mcp.json", ".")
  .action(publish);

program
  .command("install")
  .description("Install an MCP server from the registry")
  .argument("<name>", "Name of the server (e.g., @scope/name)")
  .option("-v, --version <version>", "Specific version to install")
  .action(install);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
