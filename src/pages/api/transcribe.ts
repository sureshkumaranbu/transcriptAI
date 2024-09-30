// pages/api/transcribe.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFileFromS3 } from '../../lib/s3'  // adjust the import path as needed

async function processFile(bucket: string, key: string) {
  try {
    const fileData = await getFileFromS3(bucket, key);
    console.log(`Successfully retrieved file: ${key} from bucket: ${bucket}`);
    console.log(`File size: ${fileData.length} bytes`);
    // Add your transcription logic here
    return { success: true, message: 'File processed successfully' };
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
    const { bucket, key } = req.body;
    const result = await processFile(bucket, key);
    res.status(result.success ? 200 : 500).json(result);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}