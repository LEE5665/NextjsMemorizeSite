// app/explore/page.tsx
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import ExploreTab from './Tab'
import axios from 'axios'

export const dynamic = 'force-dynamic'

export default async function ExplorePage({ searchParams }) {
  const param = await searchParams
  const page = parseInt(param?.page || '1')
  const baseURL = process.env.NEXTAUTH_URL
  const res = await axios.get(`${baseURL}/api/explore?page=${page}`)
  const quizSets = res.data.quizSets
  const total = res.data.total

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 bg-white dark:bg-zinc-900">
          <ExploreTab initialQuizSets={quizSets} initialPage={page} total={total} />
        </main>
      </div>
    </div>
  )
}
