import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'add_listing_indices'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    await this.db.rawQuery(`
      CREATE EXTENSION IF NOT EXISTS pg_trgm;
      CREATE INDEX IF NOT EXISTS idx_listings_address ON listings USING gin(address gin_trgm_ops);
      CREATE INDEX IF NOT EXISTS idx_listings_ref ON listings (ref);
      CREATE INDEX IF NOT EXISTS idx_listings_for_sale ON listings (for_sale);
      CREATE INDEX IF NOT EXISTS idx_listings_type ON listings (type);
      CREATE INDEX IF NOT EXISTS idx_listings_price ON listings (price);
      CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings (created_at DESC);
    `)
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
