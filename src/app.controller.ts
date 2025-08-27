import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Health Check',
    description: 'Verifica se a aplicação está funcionando corretamente',
  })
  @ApiResponse({
    status: 200,
    description: 'Aplicação está funcionando',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Hello World!',
        },
      },
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({
    summary: 'Status da Aplicação',
    description: 'Endpoint para monitoramento da saúde da aplicação',
  })
  @ApiResponse({
    status: 200,
    description: 'Sistema está operacional',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2025-01-01T00:00:00.000Z' },
        uptime: { type: 'number', example: 123.45 },
      },
    },
  })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
