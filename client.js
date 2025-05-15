import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "child_process";
import readline from "readline";

const transport = new StdioClientTransport({
  command: "node",
  args: ["server.js", "/Users/hrushikeshkothem/temp/mcp-filesystem/temp"],
});

const client = new Client(
  { name: "mcp-cli", version: "0.1.0" },
  {
    capabilities: {
      tools: true,
    },
  }
);
await client.connect(transport);

const tools = await client.listTools();

async function askOllama(prompt) {
  return new Promise((resolve, reject) => {
    const ollama = spawn("ollama", ["run", "phi3:3.8b", "--format", "json"]);

    let output = "";
    ollama.stdout.on("data", (data) => (output += data.toString()));
    ollama.stderr.on("data", (err) => console.error(err.toString()));

    ollama.stdin.write(prompt + "\n");
    ollama.stdin.end();

    ollama.on("close", () => {
      try {
        const parsed = JSON.parse(output);
        resolve(parsed);
      } catch (e) {
        reject("Invalid JSON response from Ollama.");
      }
    });
  });
}

// 3. Parse and route tool calls
async function handleToolCall(call) {
  if (!call?.tool_choice) {
    console.log("No valid tool call found.");
    return;
  }

  const toolName = call.tool_choice.name;
  const args = call.tool_choice.arguments;

  try {
    console.log(toolName, args);
    const result = await client.callTool({
      name: toolName,
      arguments: args,
    });
    console.log("[TOOL RESULT]:", result.content[0].text);
  } catch (e) {
    console.error("Tool failed:", e instanceof Error ? e.message : String(e));
  }
}

// 4. Prompt loop
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  while (true) {
    await new Promise((resolve) => {
      rl.question("You> ", async (input) => {
        const prompt = `You are a friendly assistant with access to the following tools:
${JSON.stringify(tools, null, 2)}
{
  "tool_choice": {
    "name": "mkdir",
    "arguments": {
      "dir": "<the requested path>"
    }
  }
}
choose a tool only when user specifically told.
For any other conversation, just respond normally as a helpful friend. Don't mention tools or directories unless specifically asked.

User: "${input}"
Assistant: `;

        try {
          const parsed = await askOllama(prompt);
          console.log(parsed);
          if (parsed.tool_choice?.name !== undefined) {
            await handleToolCall(parsed);
          }
        } catch (err) {
          console.error(
            "Error:",
            err instanceof Error ? err.message : String(err)
          );
        }

        resolve();
      });
    });
  }
}

main().catch((err) => {
  console.error(
    "Fatal error:",
    err instanceof Error ? err.message : String(err)
  );
  process.exit(1);
});
