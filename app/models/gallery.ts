import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Listing from '#models/listing'

export default class Gallery extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare listingId: number

  @column()
  declare url: string

  @column()
  declare filename: string

  @column()
  declare mimeType: string | null

  @column()
  declare size: number | null

  @column()
  declare order: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Listing)
  declare listing: BelongsTo<typeof Listing>
}
