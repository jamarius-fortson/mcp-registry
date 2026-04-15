import axios from "axios";
import chalk from "chalk";
import ora from "ora";

const API_BASE_URL = process.env.MCP_REGISTRY_URL || "http://localhost:8000";

export async function search(query: string) {
  const spinner = ora(`Searching for "${query}"...`).start();

  try {
    const response = await axios.get(`${API_BASE_URL}/v1/search`, {
      params: { q: query }
    });

    const results = response.data;

    if (results.length === 0) {
      spinner.info(chalk.yellow(`No servers found matching "${query}"`));
      return;
    }

    spinner.succeed(chalk.green(`Found ${results.length} server(s):`));
    console.log("");

    results.forEach((s: any) => {
      console.log(chalk.bold.blue(s.name));
      console.log(chalk.gray(`  ${s.description}`));
      console.log("");
    });

  } catch (error: any) {
    spinner.fail(chalk.red(`Search failed: ${error.message}`));
  }
}
