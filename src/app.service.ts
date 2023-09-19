import { Injectable } from '@nestjs/common';
import configuration from './config/configuration';

@Injectable()
export class AppService {
  getHello(): string {
    console.log(configuration().secretCode)
    return 'Hello World!';
  }
}
