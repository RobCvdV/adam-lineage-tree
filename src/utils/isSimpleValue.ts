export function isSimpleValue(value: any): boolean {
  // Check if the value is null or undefined
  if (value === null || value === undefined) {
    return true;
  }
  
  // Check if the value is a primitive type
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return true;
  }
  
  // Check if the value is an empty object or array
  if ((Array.isArray(value) && value.length === 0) || (typeof value === 'object' && Object.keys(value).length === 0)) {
    return true;
  }
  
  // If none of the above, it's not a simple value
  return false;
}

export function getSimpleValue<T extends string | number | boolean>(value: unknown, def: T = '' as T): string | number | boolean {
  if (isSimpleValue(value)) {
    return value as T;
  }
  return def;
}
