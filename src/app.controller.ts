import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { UseMethodDecorators } from './decorators/decorator-factory';
import { Log } from './decorators/logging-decorator';

@Controller()
@Log()
//@UseMethodDecorators(Log())
export class AppController {
  constructor(private readonly appService: AppService) {}

  //@Log()
  @Get()
  getHello(): string {
    return this.appService.getHelloServiceMethod(1);
  }

  //@Log()
  @Get('2')
  getHello2(): string {
    return this.appService.getHelloServiceMethod(2);
  }
}
