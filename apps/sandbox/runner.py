import asyncio
import json
import os
import sys
from typing import List, Dict, Any
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def introspect_server_stdio(command: str, args: List[str], env: Dict[str, str]):
    """
    Connect to an MCP server via stdio and probe its capabilities.
    """
    server_params = StdioServerParameters(
        command=command,
        args=args,
        env={**os.environ, **env}
    )

    capabilities = {
        "tools": [],
        "resources": [],
        "prompts": []
    }

    try:
        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()

                # 1. List Tools
                tools_result = await session.list_tools()
                capabilities["tools"] = [
                    {"name": t.name, "description": t.description, "inputSchema": t.inputSchema}
                    for t in tools_result.tools
                ]

                # 2. List Resources
                resources_result = await session.list_resources()
                capabilities["resources"] = [
                    {"name": r.name, "uri": str(r.uri), "description": r.description}
                    for r in resources_result.resources
                ]

                # 3. List Prompts
                prompts_result = await session.list_prompts()
                capabilities["prompts"] = [
                    {"name": p.name, "description": p.description}
                    for p in prompts_result.prompts
                ]

        return capabilities, None
    except Exception as e:
        return None, str(e)

if __name__ == "__main__":
    # For standalone testing: python runner.py <command> <args_json> <env_json>
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing command"}))
        sys.exit(1)

    cmd = sys.argv[1]
    args = json.loads(sys.argv[2]) if len(sys.argv) > 2 else []
    env = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}

    res, err = asyncio.run(introspect_server_stdio(cmd, args, env))
    
    if err:
        print(json.dumps({"error": err}))
        sys.exit(1)
    else:
        print(json.dumps(res, indent=2))
