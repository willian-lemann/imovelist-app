import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Gallery from '#models/gallery'
import User from './user.js'

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

  @column({ columnName: 'for_sale' })
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

  @column({ columnName: 'placeholder_image' })
  declare placeholderImage: string | null

  @column({ columnName: 'agent_id' })
  declare agentId: number | null

  @column()
  declare published: boolean

  @hasMany(() => Gallery)
  declare gallery: HasMany<typeof Gallery>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
