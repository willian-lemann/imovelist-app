import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  type PutObjectCommandInput,
} from '@aws-sdk/client-s3'
import env from '#start/env'
import { cuid } from '@adonisjs/core/helpers'

/**
 * StorageService - Uses AWS S3 SDK to interact with Supabase Storage
 *
 * Supabase Storage is S3-compatible, so we can use the AWS SDK directly
 * with the S3 endpoint provided by Supabase.
 */
export class StorageService {
  private client: S3Client
  private bucket: string
  private publicUrl: string

  constructor() {
    const region = env.get('S3_REGION', 'us-east-1')
    const endpoint = env.get('S3_ENDPOINT')
    const accessKeyId = env.get('S3_ACCESS_KEY_ID')
    const secretAccessKey = env.get('S3_SECRET_ACCESS_KEY')
    this.bucket = env.get('S3_BUCKET', 'gallery')
    this.publicUrl = env.get('S3_PUBLIC_URL', endpoint)

    this.client = new S3Client({
      region,
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true, // Required for Supabase S3 compatibility
    })
  }

  /**
   * Upload a file from buffer
   */
  async uploadFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    folder: string = 'listings'
  ): Promise<{ url: string; filename: string; size: number; mimeType: string }> {
    // Generate unique filename with original extension
    const extension =
      this.getExtensionFromOriginalName(originalName) || this.getExtensionFromMimeType(mimeType)
    const filename = `${folder}/${cuid()}.${extension}`

    const params: PutObjectCommandInput = {
      Bucket: this.bucket,
      Key: filename,
      Body: buffer,
      ContentType: mimeType,
      ContentLength: buffer.length,
    }

    await this.client.send(new PutObjectCommand(params))

    // Construct public URL
    const url = `${this.publicUrl}/object/public/${this.bucket}/${filename}`

    return {
      url,
      filename,
      size: buffer.length,
      mimeType,
    }
  }

  /**
   * Upload multiple files from buffers
   */
  async uploadMultipleFiles(
    files: Array<{ buffer: Buffer; originalName: string; mimeType: string }>,
    folder: string = 'listings'
  ): Promise<Array<{ url: string; filename: string; size: number; mimeType: string }>> {
    const uploads = files.map((file) =>
      this.uploadFile(file.buffer, file.originalName, file.mimeType, folder)
    )
    return Promise.all(uploads)
  }

  /**
   * Delete a file from storage
   */
  async delete(filename: string): Promise<void> {
    const params = {
      Bucket: this.bucket,
      Key: filename,
    }

    await this.client.send(new DeleteObjectCommand(params))
  }

  /**
   * Delete multiple files from storage
   */
  async deleteMultiple(filenames: string[]): Promise<void> {
    const deletions = filenames.map((filename) => this.delete(filename))
    await Promise.all(deletions)
  }

  /**
   * Extract filename from URL
   */
  extractFilenameFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split('/')
      // URL format: /object/public/bucket/folder/filename
      const bucketIndex = pathParts.indexOf(this.bucket)
      if (bucketIndex !== -1) {
        return pathParts.slice(bucketIndex + 1).join('/')
      }
      return null
    } catch {
      return null
    }
  }

  /**
   * Get file extension from original filename
   */
  private getExtensionFromOriginalName(filename: string): string | null {
    const parts = filename.split('.')
    if (parts.length > 1) {
      return parts[parts.length - 1].toLowerCase()
    }
    return null
  }

  /**
   * Get file extension from mime type
   */
  private getExtensionFromMimeType(mimeType: string): string {
    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'image/svg+xml': 'svg',
      'image/heic': 'heic',
      'image/heif': 'heif',
    }

    return mimeToExt[mimeType] || 'jpg'
  }
}

// Export singleton instance
export const storageService = new StorageService()
