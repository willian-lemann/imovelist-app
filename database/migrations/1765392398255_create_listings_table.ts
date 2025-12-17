import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateListingsTable extends BaseSchema {
  protected tableName = 'listings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name').nullable()
      table.string('link').nullable()
      table.string('image').nullable()
      table.string('address').nullable()
      table.decimal('price', 12, 2).nullable()
      table.string('area').nullable()
      table.integer('bedrooms').nullable()
      table.string('type').nullable()
      table.boolean('for_sale').nullable()
      table.integer('parking').nullable()
      table.text('content').nullable()
      table.json('photos').nullable()
      table.string('agency').nullable()
      table.integer('bathrooms').nullable()
      table.string('ref').nullable()
      table.string('placeholder_image').nullable()
      table.string('agent_id').nullable()
      table.boolean('published').notNullable().defaultTo(false)

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
