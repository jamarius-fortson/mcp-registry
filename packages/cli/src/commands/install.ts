import axios from "axios";
import chalk from "chalk";
import ora from "ora";

const API_BASE_URL = process.env.MCP_REGISTRY_URL || "http://localhost:8000";

export async function install(name: string, options: { version?: string }) {
  const spinner = ora(`Fetching ${name}...`).start();

  try {
    // Standardize name for URL
    const sanitizedName = name.startsWith("@") ? name.substring(1) : name;
    const version = options.version || "latest"; // Note: API needs a specific version for now or 'latest' resolver
    
    // For Phase 2, we assume the user provides a version or we fetch a specific one
    const targetVersion = options.version || "1.0.0"; 
    const url = `${API_BASE_URL}/v1/servers/${sanitizedName}/${targetVersion}`;

    const response = await axios.get(url);
    const { metadata } = response.data;

    spinner.succeed(chalk.green(`Found ${name}@${metadata.version}`));
    
    console.log(chalk.gray("\nManifest Details:"));
    console.log(chalk.white(`  Runtime: ${metadata.runtime.type}`));
    console.log(chalk.white(`  Package: ${metadata.runtime.package.name}@${metadata.runtime.package.version}`));
    
    console.log(chalk.yellow("\n[Phase 2 Stub] If this were Phase 3:"));
    console.log(chalk.cyan(`  - Running: npm install -g ${metadata.runtime.package.name}`));
    console.log(chalk.cyan(`  - Linking: to Claude Desktop config...`));

  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      spinner.fail(chalk.red(`Server not found or API error: ${error.response?.data?.detail || error.message}`));
    } else {
      spinner.fail(chalk.red(`Unexpected error: ${error.message}`));
    }
  }
}
