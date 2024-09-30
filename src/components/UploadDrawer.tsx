'use client'

import { useState, useCallback } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from "@/components/hooks/use-toast"
import { useDropzone } from 'react-dropzone'
import { FileAudio, FileVideo, X } from 'lucide-react'

export default function UploadDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [files, setFiles] = useState<File[]>([])
  const [fileStatuses, setFileStatuses] = useState<{ [key: string]: 'idle' | 'uploading' | 'transcribing' | 'done' }>({})
  const { toast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles])
    acceptedFiles.forEach(file => {
      setFileStatuses(prev => ({ ...prev, [file.name]: 'idle' }))
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'audio/*': [],
      'video/*': []
    }
  })

  const removeFile = (file: File) => {
    setFiles(prev => prev.filter(f => f !== file))
    setFileStatuses(prev => {
      const newStatuses = { ...prev }
      delete newStatuses[file.name]
      return newStatuses
    })
  }

  const uploadAndTranscribeFile = async (file: File) => {
    setFileStatuses(prev => ({ ...prev, [file.name]: 'uploading' }))
    const formData = new FormData()
    formData.append('file', file)

    try {
      // Upload file
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Upload failed')
      }

      const uploadResult = await uploadResponse.json()

      // Start transcription
      setFileStatuses(prev => ({ ...prev, [file.name]: 'transcribing' }))
      const transcribeResponse = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName: uploadResult.files[0].s3Key }),
      })

      if (!transcribeResponse.ok) {
        throw new Error('Transcription failed')
      }

      const transcribeResult = await transcribeResponse.json()

      setFileStatuses(prev => ({ ...prev, [file.name]: 'done' }))
      toast({
        title: 'Process Complete',
        description: `${file.name} has been uploaded and transcribed successfully.`,
      })
    } catch (error) {
      console.error('Error:', error)
      setFileStatuses(prev => ({ ...prev, [file.name]: 'idle' }))
      toast({
        title: 'Process Failed',
        description: `There was an error processing ${file.name}. Please try again.`,
        variant: 'destructive',
      })
    }
  }

  const processAllFiles = () => {
    files.forEach(file => {
      if (fileStatuses[file.name] === 'idle') {
        uploadAndTranscribeFile(file)
      }
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Upload Audio or Video</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div {...getRootProps()} className="border-2 border-dashed border-input rounded-lg p-6 text-center cursor-pointer">
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <>
                <p className="mb-4">Drag & drop audio or video files here, or click to select files</p>
                <Button type="button">Browse files</Button>
              </>
            )}
          </div>
          {files.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Selected Files:</h3>
              <ul className="space-y-2">
                {files.map(file => (
                  <li key={file.name} className="flex items-center justify-between bg-secondary p-2 rounded">
                    <span className="flex items-center">
                      {file.type.startsWith('audio') ? <FileAudio className="mr-2" /> : <FileVideo className="mr-2" />}
                      {file.name}
                    </span>
                    <div>
                      <span className="mr-2 text-sm">
                        {fileStatuses[file.name] === 'uploading' ? 'Uploading...' :
                         fileStatuses[file.name] === 'transcribing' ? 'Transcribing...' :
                         fileStatuses[file.name] === 'done' ? 'Done' : ''}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(file)} disabled={fileStatuses[file.name] !== 'idle' && fileStatuses[file.name] !== 'done'}>
                        <X size={16} />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              <Button className="mt-4 w-full" onClick={processAllFiles} disabled={files.every(file => fileStatuses[file.name] !== 'idle')}>
                Process All Files
              </Button>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="import-url">Import URL</Label>
            <div className="flex gap-2">
              <Input id="import-url" placeholder="https://" />
              <Button>Submit</Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rss-feed">RSS Feed</Label>
            <div className="flex gap-2">
              <Input id="rss-feed" placeholder="Enter RSS feed URL" />
              <Button>Submit</Button>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Zapier</h3>
            <p className="text-sm text-muted-foreground">Manage your Zapier integration in your integration settings.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Zoom</h3>
            <p className="text-sm text-muted-foreground">Manage your Zoom integration in your integration settings.</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}