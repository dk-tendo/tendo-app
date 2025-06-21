import 'reflect-metadata';

export class TableGenerator {
  static generateCreateTableQuery(schemaClass: any): string {
    const tableName = Reflect.getMetadata('tableName', schemaClass);
    const columns = Reflect.getMetadata('columns', schemaClass.prototype);
    const indexes = Reflect.getMetadata('indexes', schemaClass) || [];

    if (!tableName || !columns) {
      throw new Error(
        'Schema must have @Table decorator and @Column decorators'
      );
    }

    // Generate column definitions
    const columnDefinitions = Object.entries(columns)
      .map(([name, options]: [string, any]) => {
        let definition = `${name} ${options.type}`;

        if (options.array) {
          definition += '[]';
        }

        if (options.primary) {
          definition += ' PRIMARY KEY';
        }

        if (options.unique && !options.primary) {
          definition += ' UNIQUE';
        }

        if (options.nullable === false) {
          definition += ' NOT NULL';
        }

        if (options.default) {
          definition += ` DEFAULT ${options.default}`;
        }

        return definition;
      })
      .join(',\n          ');

    // Generate index statements
    const indexStatements = indexes
      .map((indexColumns: string[]) => {
        const indexName = `idx_${tableName}_${indexColumns.join('_')}`;
        const columns = indexColumns.join(', ');
        return `CREATE INDEX IF NOT EXISTS ${indexName} ON ${tableName}(${columns});`;
      })
      .join('\n        ');

    return `
        CREATE TABLE IF NOT EXISTS ${tableName} (
          ${columnDefinitions}
        );

        ${indexStatements}
    `.trim();
  }
}
