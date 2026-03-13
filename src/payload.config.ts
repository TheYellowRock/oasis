import { postgresAdapter } from '@payloadcms/db-postgres'
import type { GenerateFileURL } from '@payloadcms/plugin-cloud-storage/types'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Units } from './collections/Units'
import { Categories } from './collections/Categories'
import { Directory } from './collections/Directory'
import { Pages } from './collections/Pages'
import { Leads } from './collections/Leads'
import { Posts } from './collections/Posts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseAdapter = postgresAdapter({
  pool: {
    connectionString: process.env.DATABASE_URI!,
  },
})

const hasS3StorageConfig = Boolean(
  process.env.S3_ENDPOINT &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY &&
    process.env.S3_BUCKET,
)
const supabaseBaseURL = process.env.S3_ENDPOINT?.replace(/\/storage\/v1\/s3\/?$/, '')
const supabasePublicBucketURL =
  supabaseBaseURL && process.env.S3_BUCKET
    ? `${supabaseBaseURL}/storage/v1/object/public/${process.env.S3_BUCKET}`
    : ''
const generateSupabaseFileURL: GenerateFileURL = ({ filename, prefix }) => {
  const filePath = prefix ? `${prefix}/${filename}` : filename
  return supabasePublicBucketURL ? `${supabasePublicBucketURL}/${filePath}` : filePath
}
const storagePlugins = hasS3StorageConfig
  ? [
      s3Storage({
        collections: {
          [Media.slug]: {
            generateFileURL: generateSupabaseFileURL,
          },
        },
        bucket: process.env.S3_BUCKET!,
        config: {
          endpoint: process.env.S3_ENDPOINT!,
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID!,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
          },
          forcePathStyle: true,
          region: 'us-east-1',
        },
      }),
    ]
  : []

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Categories, Units, Directory, Pages, Leads, Posts],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'oasis-district-dev-secret-key-change-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: databaseAdapter,
  sharp,
  plugins: storagePlugins,
})
