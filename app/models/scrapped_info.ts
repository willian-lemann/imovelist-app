import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ScrappedInfo extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare total_listings: number

  @column()
  declare total_pages: number

  @column()
  declare agency: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
