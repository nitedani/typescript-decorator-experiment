import { Injectable } from '@nestjs/common';
import { Log } from './decorators/logging-decorator';

@Injectable()
export class AppService {
  @Log()
  getHelloServiceMethod(param: any): string {
    return 'Hello World!';
  }
}
