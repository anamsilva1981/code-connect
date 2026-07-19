import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({
    schema: {
      example: {
        status: 'ok',
        name: 'Code Connect API',
      },
    },
  })
  getHealth() {
    return this.appService.getHealth();
  }
}
