import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'galleries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('listing_id')
        .unsigned()
        .references('id')
        .inTable('listings')
        .onDelete('CASCADE')
      table.string('url').notNullable()
      table.string('filename').notNullable()
      table.string('mime_type').nullable()
      table.integer('size').nullable()
      table.integer('order').defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Index for faster queries
      table.index(['listing_id', 'order'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
