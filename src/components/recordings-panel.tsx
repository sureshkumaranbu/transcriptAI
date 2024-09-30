import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Mic, Video, FileAudio } from 'lucide-react'

export function RecordingsPanel() {
  return (
    <Card>
      <CardHeader className="bg-blue-100">
        <CardTitle>Welcome to Castmagic!</CardTitle>
        <p>Get started by uploading your first recording.</p>
      </CardHeader>
      <CardContent className="text-center py-12">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-200 mb-4">
          <div className="grid grid-cols-2 gap-2">
            <Upload size={24} />
            <Mic size={24} />
            <Video size={24} />
            <FileAudio size={24} />
          </div>
        </div>
        <p className="mb-6">
          Castmagic is your place to upload all of your podcast episodes,
          voice recordings, video meetings, and more. Turn any of your media
          files into high quality transcripts immediately, and start creating
          content from them with AI.
        </p>
        <Button>Import audio or video</Button>
      </CardContent>
    </Card>
  )
}