export function Cooldown(delay: number = 2000) {
    let executing = false;
  
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const originalMethod = descriptor.value;
  
      descriptor.value = async function (...args: any[]) {
        if (!executing) {
          executing = true;
          try {
            // Llama a la función original y espera a que se complete
            const result = await originalMethod.apply(this, args);
            return result;
          } finally {
            // Activa el cooldown solo después de la finalización
            setTimeout(() => {
              executing = false;
            }, delay);
          }
        }
      };
  
      return descriptor;
    };
  }
  