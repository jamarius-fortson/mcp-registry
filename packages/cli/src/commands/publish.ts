import fs from "fs";
import path from "path";
import axios from "axios";
import { ManifestSchema } from "../schema/manifest";
import chalk from "chalk";
import ora from "ora";

const API_BASE_URL = process.env.MCP_REGISTRY_URL || "http://localhost:8000";

export async function publish(projectPath: string) {
  const spinner = ora("Reading manifest...").start();
  const manifestPath = path.resolve(projectPath, "mcp.json");

  if (!fs.existsSync(manifestPath)) {
    spinner.fail(chalk.red(`Error: mcp.json not found at ${manifestPath}`));
    process.exit(1);
  }

  try {
    const rawData = fs.readFileSync(manifestPath, "utf-8");
    const manifestJson = JSON.parse(rawData);
    
    spinner.text = "Validating manifest...";
    const manifest = ManifestSchema.parse(manifestJson);

    spinner.text = `Publishing ${manifest.name}@${manifest.version} to ${API_BASE_URL}...`;
    
    const response = await axios.post(`${API_BASE_URL}/v1/publish`, manifest);

    spinner.succeed(
      chalk.green(`Successfully published ${manifest.name}@${manifest.version}!`)
    );
    console.log(chalk.blue(`View at: ${API_BASE_URL}/servers/${manifest.name}`));
  } catch (error: any) {
    if (error.name === "ZodError") {
      spinner.fail(chalk.red("Manifest validation failed:"));
      error.errors.forEach((e: any) => {
        console.log(chalk.yellow(`  - ${e.path.join(".")}: ${e.message}`));
      });
    } else if (axios.isAxiosError(error)) {
      spinner.fail(chalk.red(`API Error: ${error.response?.data?.detail || error.message}`));
    } else {
      spinner.fail(chalk.red(`Unexpected error: ${error.message}`));
    }
    process.exit(1);
  }
}
