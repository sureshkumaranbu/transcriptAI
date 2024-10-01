// pages/api/transcribe.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFileFromS3 } from '../../lib/s3'  // adjust the import path as needed
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function transcribeAudio(filePath: string): Promise<string> {
  try {
    const transcript = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
    });
    return transcript.text;
  } catch (error) {
    console.error('Error transcribing audio:', error)
    throw error
  }
}

async function addTimestamps(transcription: string, durationInSeconds: number): Promise<any> {
  const prompt = `
Given the following transcription and the total duration of the audio in seconds, add estimated timestamps for each word. The output should be a JSON array of objects, where each object represents a word with its text, start time, and end time in seconds.

Transcription: "${transcription}"
Total Duration: ${durationInSeconds} seconds

Output the result as a valid JSON array.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  return JSON.parse(completion.choices[0].message.content || '[]');
}

async function getDuration(filePath: string): Promise<number> {
  // Implement this function to get the duration of the audio/video file
  // You might need to use a library like ffprobe or music-metadata
  // For now, we'll return a placeholder value
  return 300; // 5 minutes
}

async function processFile(key: string) {
  try {
    const bucket = process.env.AWS_S3_BUCKET_NAME;
    if (!bucket) {
      throw new Error('AWS_S3_BUCKET_NAME is not defined in environment variables');
    }
    const fileData = await getFileFromS3(bucket, key);
    console.log(`Successfully retrieved file: ${key} from bucket: ${bucket}`);
    console.log(`File size: ${fileData.length} bytes`);

    // Save file temporarily
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    const tempFilePath = path.join(tempDir, key.split('/').pop() || 'temp');
    fs.writeFileSync(tempFilePath, fileData);

    // Get audio duration
    const duration = await getDuration(tempFilePath);

    // Transcribe the audio
    const transcription = await transcribeAudio(tempFilePath);

    // Add timestamps to the transcription
    const detailedTranscription = await addTimestamps(transcription, duration);

    // Save detailed transcription to database
    const savedTranscription = await prisma.detailedTranscription.create({
      data: {
        fileKey: key,
        content: transcription,
        detailedContent: JSON.stringify(detailedTranscription),
      },
    });

    // Clean up temp file
    fs.unlinkSync(tempFilePath);

    return { success: true, message: 'File transcribed successfully', transcription: savedTranscription };
  } catch (err) {
    console.error("Error processing file:", err);
    return { success: false, message: 'Error processing file' };
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { fileName } = req.body;
    if (!fileName) {
      return res.status(400).json({ success: false, message: 'fileName is required' });
    }
    const result = await processFile(fileName);
    res.status(result.success ? 200 : 500).json(result);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}