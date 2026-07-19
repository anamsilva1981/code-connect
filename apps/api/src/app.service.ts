import { Injectable } from '@nestjs/common';

export type HealthResponse = {
  status: 'ok';
  name: 'Code Connect API';
};

@Injectable()
export class AppService {
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      name: 'Code Connect API',
    };
  }
}
