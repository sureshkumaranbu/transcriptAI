"use client"

import { useState } from "react"
import { ArrowLeft, Edit, Share2, Wand2, MessageSquare, Video, Copy, Scissors, MonitorPlay, Search, Download, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Link from "next/link"

export default function RecordingPage({ params }: { params: { id: string } }) {
  const [currentTime, setCurrentTime] = useState(0)
  const totalDuration = 9 // Total duration in seconds

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setCurrentTime(e.currentTarget.currentTime)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/recordings">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold ml-4">Recording #2</h1>
          </div>
          <div>
            <Button variant="outline" size="sm" className="mr-2">
              <Edit className="h-4 w-4 mr-2" />
              Edit recording
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
        <h2 className="text-3xl font-bold">
          This_type_of_person_will_make_millions_over_the_next_decade-clipped-000000.240-000009.414-1727555185673.mp4
        </h2>
      </div>

      <Tabs defaultValue="transcript">
        <TabsList>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="ai-content">
            <Wand2 className="h-4 w-4 mr-2" />
            AI Content
          </TabsTrigger>
          <TabsTrigger value="magic-chat">
            <MessageSquare className="h-4 w-4 mr-2" />
            Magic Chat
          </TabsTrigger>
          <TabsTrigger value="studio">
            <Video className="h-4 w-4 mr-2" />
            Studio
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Beta</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transcript" className="mt-6">
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-6">
            <video
              src="/placeholder.mp4"
              className="w-full"
              controls
              onTimeUpdate={handleTimeUpdate}
            />
          </div>

          <div className="flex space-x-2 mb-6">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Transcript (⌘+E)
            </Button>
            <Button variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy selection
            </Button>
            <Button variant="outline" size="sm">
              <Scissors className="h-4 w-4 mr-2" />
              Clip media
            </Button>
            <Button variant="outline" size="sm">
              <MonitorPlay className="h-4 w-4 mr-2" />
              Studio
            </Button>
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Find & replace
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download transcript
            </Button>
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Speakers
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex">
              <div className="w-24 flex-shrink-0">
                <span className="font-semibold">Greg</span>
                <br />
                <span className="text-gray-500 text-sm">00:00:00</span>
              </div>
              <p className="flex-grow">
                Greg had an amazing quote today on Twitter. He said, the most unstoppable person on the planet right now is someone who knows
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-content">AI Content tab content</TabsContent>
        <TabsContent value="magic-chat">Magic Chat tab content</TabsContent>
        <TabsContent value="studio">Studio tab content</TabsContent>
      </Tabs>
    </div>
  )
}