import UploadButton from '@/components/UploadButton'
import WelcomeCard from '@/components/WelcomeCard'
import MediaCircle from '@/components/MediaCircle'

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Recordings</h1>
        <UploadButton />
      </div>
      <WelcomeCard />
      <div className="flex justify-center">
        <MediaCircle />
      </div>
    </div>
  )
}