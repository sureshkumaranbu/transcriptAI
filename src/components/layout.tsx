import React from 'react'
import { Button } from '@/components/ui/button'
import { MenuIcon } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <span className="text-xl font-semibold">Castmagic</span>
          </div>
          <nav className="flex-1 px-2 pb-4 space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              Media Library
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              My Space
            </Button>
            {/* Add more navigation items here */}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between px-4 py-4 bg-white border-b md:hidden">
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-6 w-6" />
          </Button>
          <span className="text-xl font-semibold">Castmagic</span>
        </header>
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  )
}