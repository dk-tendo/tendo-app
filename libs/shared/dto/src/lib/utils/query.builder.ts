export class QueryBuilder {
  static buildInsertQuery(
    tableName: string,
    data: Record<string, any>,
    excludeFields: string[] = []
  ): { query: string; values: any[] } {
    // Filter out undefined values and excluded fields
    const filteredData = Object.entries(data)
      .filter(
        ([key, value]) => value !== undefined && !excludeFields.includes(key)
      )
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const columns = Object.keys(filteredData);
    const values = Object.values(filteredData);

    // Generate placeholders ($1, $2, $3, etc.)
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
    const columnList = columns.join(', ');

    const query = `
      INSERT INTO ${tableName} (${columnList})
      VALUES (${placeholders})
      RETURNING *
    `;

    return { query: query.trim(), values };
  }

  static buildUpdateQuery(
    tableName: string,
    id: string,
    data: Record<string, any>,
    excludeFields: string[] = ['id', 'created_at']
  ): { query: string; values: any[] } {
    const filteredData = Object.entries(data)
      .filter(
        ([key, value]) => value !== undefined && !excludeFields.includes(key)
      )
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const columns = Object.keys(filteredData);
    const values = Object.values(filteredData);

    if (columns.length === 0) {
      throw new Error('No fields to update');
    }

    const setClause = columns
      .map((column, index) => `${column} = $${index + 2}`)
      .join(', ');

    const query = `
      UPDATE ${tableName}
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    return { query: query.trim(), values: [id, ...values] };
  }
}
