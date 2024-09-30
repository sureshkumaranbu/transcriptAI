import { FileAudio, FileVideo, Mic, Video } from 'lucide-react'

export default function MediaCircle() {
  return (
    <div className="relative w-64 h-64">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 bg-secondary rounded-full flex items-center justify-center">
          <FileAudio size={40} className="text-secondary-foreground" />
        </div>
      </div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
          <Mic size={24} className="text-secondary-foreground" />
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
          <Video size={24} className="text-secondary-foreground" />
        </div>
      </div>
      <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
          <FileVideo size={24} className="text-secondary-foreground" />
        </div>
      </div>
      <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
          <FileAudio size={24} className="text-secondary-foreground" />
        </div>
      </div>
    </div>
  )
}