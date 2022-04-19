import { aroundMethodDecarator } from './decorator-factory';

export const Log = (options?: any) => {
  return aroundMethodDecarator(async (args: any[], name, next) => {
    console.log(name, 'was called with args', args);
    const result = await next(...args);
    console.log(name, 'returned', result);
    return result;
  });
};
