// app/explore/page.tsx
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import ExploreTab from './Tab'

export const dynamic = 'force-dynamic'

export default function ExplorePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <ExploreTab />
        </main>
      </div>
    </div>
  )
}