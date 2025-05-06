import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from 'zod';


//! 01. Crear el servidor
//! es la interfaz principal con el protocolo MCP, maneja la comunicacíón entre el cliente y el servidor
const server = new McpServer({
  name: 'Demo',
  version: '1.0.0'
})

//! 02. Definir las herramientas
//! las herramientas le permite al LLM realizar acciones a travéz del servidor

server.tool(
  'fetch-weather', //! titulo de la herramienta
  'Tool to fetch the weather of a city', //! descripcion de la herramienta
  {
    city: z.string().describe('City name'),
  },
  async ({ city }) => {
    return {
      content: [
        {
          type: 'text',
          text: `El clima de ${city} es soleado.`
        }
      ]
    }
  }
)

//! 03. Escuchar las conexiones del cliente

const transport = new StdioServerTransport()
await server.connect(transport)