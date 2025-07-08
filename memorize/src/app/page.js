// app/explore/page.tsx
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ExploreTab from './components/Tab'
import axios from 'axios'

export default async function ExplorePage() {
  const baseURL = process.env.NEXTAUTH_URL
  const res = await axios.get(`${baseURL}/api/explore`)
  const quizSets = res.data.quizSets

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 bg-black">
          <ExploreTab initialQuizSets={quizSets} />
        </main>
      </div>
    </div>
  )
}
