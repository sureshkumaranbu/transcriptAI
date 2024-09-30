import 'dotenv/config'
import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm, File } from 'formidable'
import fs from 'fs'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3Client } from '@/lib/s3'
import { PrismaClient } from '@prisma/client'

console.log('DATABASE_URL:', process.env.DATABASE_URL) // Keep this log

const prisma = new PrismaClient()

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const form = new IncomingForm()
  form.keepExtensions = true

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err)
      return res.status(500).json({ message: 'Error uploading file' })
    }

    try {
      const uploadedFiles = Array.isArray(files.file) ? files.file : [files.file]
      const fileDetails = await Promise.all(uploadedFiles.map(async (file) => {
        if (!file) {
          throw new Error('No file uploaded')
        }

        const fileStream = fs.createReadStream(file.filepath)
        const key = `uploads/${Date.now()}-${file.originalFilename}`
        const uploadParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: key,
          Body: fileStream,
        }

        try {
          await s3Client.send(new PutObjectCommand(uploadParams))
          
          // Save file metadata to database
          const savedFile = await prisma.file.create({
            data: {
              name: file.originalFilename || 'unknown',
              key: key,
              type: file.mimetype || 'application/octet-stream',
            },
          })

          return savedFile
        } catch (error) {
          console.error('Error uploading to S3 or saving to database:', error)
          throw error
        } finally {
          fs.unlinkSync(file.filepath) // Clean up the temp file
        }
      }))

      res.status(200).json({ message: 'Files uploaded successfully', files: fileDetails })
    } catch (error) {
      console.error('Error processing files:', error)
      res.status(500).json({ message: 'Error processing files' })
    }
  })
}