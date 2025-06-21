import 'reflect-metadata';

export interface ColumnOptions {
  type: string;
  nullable?: boolean;
  unique?: boolean;
  default?: string;
  primary?: boolean;
  array?: boolean;
}

export function Column(options: ColumnOptions) {
  return function (target: any, propertyKey: string) {
    const columns = Reflect.getMetadata('columns', target) || {};
    columns[propertyKey] = options;
    Reflect.defineMetadata('columns', columns, target);
  };
}

export function Table(name: string) {
  return function (constructor: any) {
    Reflect.defineMetadata('tableName', name, constructor);
  };
}

export function Index(columns: string[]) {
  return function (constructor: any) {
    const indexes = Reflect.getMetadata('indexes', constructor) || [];
    indexes.push(columns);
    Reflect.defineMetadata('indexes', indexes, constructor);
  };
}
