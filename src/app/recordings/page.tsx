// File: /src/app/recordings/page.tsx

import { PrismaClient } from '@prisma/client'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, FileAudio, Plus } from "lucide-react"
import { RecordingsTable } from './RecordingsTable'
import { Button } from "@/components/ui/button"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

async function getRecordings() {
  const recordings = await prisma.file.findMany({
    orderBy: {
      createdAt: 'desc'  // Changed from uploadedAt to createdAt
    },
    include: {
      transcription: true
    }
  })
  return recordings
}

export default async function RecordingsPage() {
  const recordings = await getRecordings()

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Recordings</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Import audio or video
        </Button>
      </div>

      <Alert className="mb-6 bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertTitle className="text-green-700">You have new transcripts!</AlertTitle>
        <AlertDescription className="text-green-600">
          Click on a recording below to view your transcript, generate AI content, and more.
        </AlertDescription>
      </Alert>

      <div className="mb-6">
        <Button variant="outline" className="text-gray-500">
          <FileAudio className="mr-2 h-4 w-4" /> Generate page
        </Button>
      </div>

      <RecordingsTable recordings={recordings} />
    </div>
  )
}