const copyMetadata = (source: any, target: any): void => {
  for (const key of Reflect.getMetadataKeys(source)) {
    Reflect.defineMetadata(key, Reflect.getMetadata(key, source), target);
  }
};

const applyDecoratorAllClassMethods = (_target: any, decoratorFn) => {
  for (const __key of Object.getOwnPropertyNames(_target.prototype)) {
    // maybe blacklist methods here
    const _descriptor = Object.getOwnPropertyDescriptor(
      _target.prototype,
      __key,
    );
    if (_descriptor) {
      const originalMethod = _descriptor.value;
      _descriptor.value = function (...args: any[]) {
        return decoratorFn(args, __key, originalMethod.bind(this));
      };
      Object.defineProperty(_target.prototype, __key, _descriptor);
      copyMetadata(originalMethod, _descriptor.value);
    }
  }
};

const applyMethodDecorator = (_key, descriptor, decoratorFn) => {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    return decoratorFn(args, _key, originalMethod.bind(this));
  };

  copyMetadata(originalMethod, descriptor.value);

  return descriptor;
};

export const aroundMethodDecarator = (
  decoratorFn: (
    args: any[],
    name: string,
    next: (..._args: any[]) => any,
  ) => any,
): any => {
  return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
    const isClass = _isClass(_target);
    if (isClass) {
      applyDecoratorAllClassMethods(_target, decoratorFn);
    } else {
      return applyMethodDecorator(_key, descriptor, decoratorFn);
    }
  };
};

export const UseMethodDecorators = <T>(...decorators: MethodDecorator[]) => {
  return function (target: new (...params: any[]) => T) {
    for (const key of Object.getOwnPropertyNames(target.prototype)) {
      // maybe blacklist methods here
      let descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
      if (descriptor) {
        for (const decorator of decorators) {
          descriptor = decorator(null, key, descriptor) as PropertyDescriptor;
          Object.defineProperty(target.prototype, key, descriptor);
        }
      }
    }
  };
};

export const _isClass = (func) =>
  typeof func === 'function' &&
  /^class\s/.test(Function.prototype.toString.call(func));
