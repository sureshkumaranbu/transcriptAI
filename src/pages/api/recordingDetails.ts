import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3Client } from '@/lib/s3'

const prisma = new PrismaClient()

type Word = {
  text: string
  start: number
  end: number
}

function createWordLevelTranscript(content: string, durationInSeconds: number): Word[] {
  const words = content.split(' ')
  const totalWords = words.length
  const averageWordDuration = durationInSeconds / totalWords

  let currentTime = 0
  return words.map((word) => {
    const wordDuration = (word.length / 5) * averageWordDuration // Adjust duration based on word length
    const start = currentTime
    currentTime += wordDuration
    return {
      text: word,
      start: parseFloat(start.toFixed(2)),
      end: parseFloat(currentTime.toFixed(2))
    }
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { id } = req.query

  try {
    const file = await prisma.file.findUnique({
      where: { id: String(id) },
      include: { transcription: true }
    })

    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: file.key,
    })

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

    let processedTranscription = null
    if (file.transcription) {
      // Assuming you have a way to get the duration of the audio/video file
      // For now, we'll use a placeholder value
      const durationInSeconds = 300 // 5 minutes, replace with actual duration

      processedTranscription = {
        ...file.transcription,
        words: createWordLevelTranscript(file.transcription.content, durationInSeconds)
      }
    }

    res.status(200).json({
      ...file,
      signedUrl,
      transcription: processedTranscription
    })
  } catch (error) {
    console.error('Error fetching file:', error)
    res.status(500).json({ message: 'Error fetching file' })
  } finally {
    await prisma.$disconnect()
  }
}