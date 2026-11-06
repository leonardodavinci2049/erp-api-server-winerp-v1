import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'No bugs. No features. Just peace.';
  }
}
