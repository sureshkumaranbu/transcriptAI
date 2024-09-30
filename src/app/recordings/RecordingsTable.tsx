'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle } from "lucide-react"

type Recording = {
  id: number
  name: string
  type: string
  uploadedAt: Date
  transcription?: {
    status: string
  }
}

type RecordingsTableProps = {
  recordings: Recording[]
}

export function RecordingsTable({ recordings }: RecordingsTableProps) {
  const router = useRouter()

  const handleRowClick = (id: number) => {
    router.push(`/recordings/${id}`)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40px]"></TableHead>
          <TableHead className="w-[40px]">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Uploaded At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recordings.map((recording) => (
          <TableRow 
            key={recording.id} 
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => handleRowClick(recording.id)}
          >
            <TableCell onClick={(e) => e.stopPropagation()}>
              <Checkbox />
            </TableCell>
            <TableCell>{recording.id}</TableCell>
            <TableCell className="font-medium">
              {recording.name}
            </TableCell>
            <TableCell>{recording.type}</TableCell>
            <TableCell>
              <span className="flex items-center text-green-600">
                <CheckCircle className="mr-2 h-4 w-4" /> 
                {recording.transcription?.status || 'No transcription'}
              </span>
            </TableCell>
            <TableCell>{new Date(recording.uploadedAt).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" className="mr-2" onClick={(e) => { e.stopPropagation(); /* Handle edit */ }}>Edit</Button>
              <Button variant="ghost" className="text-red-600" onClick={(e) => { e.stopPropagation(); /* Handle delete */ }}>Delete</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}