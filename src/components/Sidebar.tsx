import Link from 'next/link'
import { Home, FileAudio, FileText, Users, Settings, HelpCircle, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Sidebar() {
  return (
    <div className="w-64 bg-card h-full flex flex-col border-r">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Castmagic</h1>
      </div>
      <nav className="flex-1 space-y-1">
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/">
            <Home className="mr-3" size={20} />
            My Space
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/recordings">
            <FileAudio className="mr-3" size={20} />
            Recordings
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/pages">
            <FileText className="mr-3" size={20} />
            Pages
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/speakers">
            <Users className="mr-3" size={20} />
            Speakers
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/settings">
            <Settings className="mr-3" size={20} />
            Settings
          </Link>
        </Button>
      </nav>
      <div className="p-4 space-y-2">
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/help">
            <HelpCircle className="mr-3" size={20} />
            Help & quickstart guide
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <LogOut className="mr-3" size={20} />
          Sign out
        </Button>
      </div>
    </div>
  )
}