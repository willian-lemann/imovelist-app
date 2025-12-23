import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Listing extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare name: string | null

  @column()
  declare link: string | null

  @column()
  declare image: string | null

  @column()
  declare address: string | null

  @column()
  declare price: number | null

  @column()
  declare area: number | null

  @column()
  declare bedrooms: number | null

  @column()
  declare type: string | null

  @column()
  declare forSale: boolean | null

  @column()
  declare parking: number | null

  @column()
  declare content: string | null

  @column()
  declare photos: string[] | null

  @column()
  declare agency: string | null

  @column()
  declare bathrooms: number | null

  @column()
  declare ref: string | null

  @column()
  declare placeholderImage: string | null

  @column()
  declare agent_id: string | null

  @column()
  declare published: boolean
}
