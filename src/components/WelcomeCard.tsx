import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function WelcomeCard({ onUpload }: { onUpload: () => void }) {
  return (
    <Card className="bg-card">
      <CardContent className="p-6 flex flex-col sm:flex-row items-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">Welcome to Castmagic!</h2>
          <p className="text-muted-foreground mb-4 sm:mb-0">Get started by uploading your first recording.</p>
        </div>
        <div className="ml-auto mt-4 sm:mt-0">
          <Button onClick={onUpload} className="flex items-center gap-2">
            <Plus size={20} />
            Upload Recording
          </Button>
        </div>
        <img src="/castmagic-logo.svg" alt="Castmagic logo" className="ml-auto mt-4 sm:mt-0" width="80" height="80" />
      </CardContent>
    </Card>
  )
}