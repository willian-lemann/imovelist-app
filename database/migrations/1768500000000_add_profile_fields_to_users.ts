import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('profile_photo').nullable()
      table.string('whatsapp').nullable()
      table.string('profile_url').nullable().unique()
      table.string('logo').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('profile_photo')
      table.dropColumn('whatsapp')
      table.dropColumn('profile_url')
      table.dropColumn('logo')
    })
  }
}
