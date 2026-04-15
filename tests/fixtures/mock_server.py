import sys
import json

def main():
    # A simple mock MCP server that speaks stdio JSON-RPC (minimal)
    # The actual official SDK handles the heavy lifting, but we can use
    # a simple script for basic connectivity testing.
    
    # Actually, it's easier to use the official SDK to build a mock server too.
    from mcp.server import Server, NotificationOptions
    from mcp.server.models import InitializationOptions
    import mcp.types as types
    from mcp.server.stdio import stdio_server

    app = Server("mock-server")

    @app.list_tools()
    async def list_tools() -> list[types.Tool]:
        return [
            types.Tool(
                name="get_weather",
                description="Get weather for a location",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "location": {"type": "string"}
                    }
                }
            )
        ]

    @app.list_resources()
    async def list_resources() -> list[types.Resource]:
        return [
            types.Resource(
                uri="file:///logs/main.log",
                name="Main Logs",
                description="System logs"
            )
        ]

    @app.list_prompts()
    async def list_prompts() -> list[types.Prompt]:
        return [
            types.Prompt(
                name="summarize_logs",
                description="Summarize the system logs"
            )
        ]

    async def run():
        async with stdio_server() as (read, write):
            await app.run(
                read,
                write,
                InitializationOptions(
                    server_name="mock-server",
                    server_version="1.0.0",
                    capabilities=app.get_capabilities(
                        notification_options=NotificationOptions(),
                        experimental_capabilities={}
                    )
                )
            )

    import asyncio
    asyncio.run(run())

if __name__ == "__main__":
    main()
