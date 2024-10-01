"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ArrowLeft, Edit, Share2, Wand2, MessageSquare, Video, Copy, Scissors, MonitorPlay, Search, Download, Users, Tv } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Link from "next/link"
import { useParams } from "next/navigation"

type Word = {
  text: string
  start: number
  end: number
}

type Recording = {
  id: string
  name: string
  key: string
  type: string
  createdAt: string
  updatedAt: string
  signedUrl: string
  transcription?: {
    id: string
    fileKey: string
    content: string
    words: Word[]
    createdAt: string
    updatedAt: string
  }
}

export default function RecordingPage() {
  const [recording, setRecording] = useState<Recording | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null)
  const transcriptRef = useRef<HTMLDivElement>(null)
  const params = useParams()

  useEffect(() => {
    const fetchRecording = async () => {
      try {
        const response = await fetch(`/api/recordingDetails?id=${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch recording')
        const data = await response.json()
        setRecording(data)
      } catch (error) {
        console.error('Error fetching recording:', error)
      }
    }

    fetchRecording()
  }, [params.id])

  const handleTimeUpdate = useCallback(() => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime)
    }
  }, [])

  const renderTranscript = useCallback(() => {
    if (!recording?.transcription?.words) return null

    return recording.transcription.words.map((word, index) => (
      <span
        key={index}
        className={`${
          currentTime >= word.start && currentTime < word.end
            ? 'bg-yellow-200'
            : ''
        } transition-colors duration-100 cursor-pointer`}
        onClick={() => {
          if (mediaRef.current) {
            mediaRef.current.currentTime = word.start
          }
        }}
      >
        {word.text}{' '}
      </span>
    ))
  }, [recording, currentTime])

  useEffect(() => {
    if (transcriptRef.current) {
      const highlightedWord = transcriptRef.current.querySelector('.bg-yellow-200')
      if (highlightedWord) {
        highlightedWord.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [currentTime])

  if (!recording) return <div>Loading...</div>

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      {/* ... (rest of the component remains the same) ... */}

      <Tabs defaultValue="transcript">
        <TabsList>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
        </TabsList>

        <TabsContent value="transcript" className="mt-6">
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-6">
            {recording.type.startsWith('video') ? (
              <video
                ref={mediaRef}
                src={recording.signedUrl}
                className="w-full"
                controls
                onTimeUpdate={handleTimeUpdate}
              />
            ) : (
              <audio
                ref={mediaRef}
                src={recording.signedUrl}
                className="w-full"
                controls
                onTimeUpdate={handleTimeUpdate}
              />
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {/* ... (buttons remain the same) ... */}
          </div>

          {recording.transcription ? (
            <div>
              <h3 className="text-lg font-semibold mb-2">Transcription</h3>
              <div ref={transcriptRef} className="transcript-container max-h-96 overflow-y-auto">
                {renderTranscript()}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Transcribed at: {new Date(recording.transcription.createdAt).toLocaleString()}
              </p>
            </div>
          ) : (
            <p>No transcription available</p>
          )}
        </TabsContent>

        <TabsContent value="summary">Summary content (if available)</TabsContent>
        <TabsContent value="topics">Topics content (if available)</TabsContent>
      </Tabs>
    </div>
  )
}