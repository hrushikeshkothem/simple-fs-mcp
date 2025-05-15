# MCP Filesystem
A simple Model Context Protocol (MCP) application that provides filesystem operations using Ollama local LLM. This project demonstrates the integration of local AI models with filesystem operations through a client-server architecture.

## Features
- Client-server architecture using MCP protocol
- Integration with Ollama local LLM (Microsoft Phi-3 3.8b model)
- Directory creation capabilities
- Conversational CLI interface
- Secure file system operations within allowed directories

## Prerequisites
- Node.js
- [Ollama](https://ollama.ai/) with Phi-3 3.8b model installed
- Basic understanding of terminal operations

## Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Configuration
The server accepts allowed directories as command-line arguments. These directories will be the only locations where the application can perform filesystem operations.

## Usage
Start the server:
```bash
npm start
```

The client will automatically start the server and connect to Ollama. You can then interact with the system through natural language commands.

Example commands:
- "Create a directory named 'test'"
- "List the files in the current directory"
- "Delete the file 'test.txt'"

## Project Structure
- `client.js`: MCP client implementation with Ollama integration
- `server.js`: MCP server implementation with filesystem operations

## Dependencies
- @modelcontextprotocol/sdk : Core MCP SDK
- Ollama : Local AI model for natural language processing
- Microsoft Phi-3 3.8b model : AI model for natural language processing

