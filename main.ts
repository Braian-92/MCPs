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
    const $lnk = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=es&format=json`;
    const response = await fetch($lnk)
    const data = await response.json();
    
    if(data.length === 0){
      return {
        content: [
          {
            type: 'text',
            text: `No se encontro la infoamcion para cuidad de ${city}`
          }
        ]
      }
    }

    const { latitude, longitude } = data.results[0];

    const lnk2 = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current=is_day,temperature_2m,precipitation,rain&forecast_days=1`;

    const weatherResponse = await fetch(lnk2);
    const weatherData = await weatherResponse.json();


    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(weatherData, null, 2)
        }
      ]
    }
  }
)

//! 03. Escuchar las conexiones del cliente

const transport = new StdioServerTransport()
await server.connect(transport)