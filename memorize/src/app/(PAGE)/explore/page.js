// app/explore/page.tsx
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import ExploreTab from './Tab'
import { headers } from 'next/headers'
import axios from 'axios'

export const dynamic = 'force-dynamic'

export default async function ExplorePage({ searchParams }) {

  const param = await searchParams

  const page = parseInt(param?.page || '1')
  const search = param?.search || ''
  const searchType = param?.searchType || 'all'

  const params = new URLSearchParams()
  params.set('page', page)
  if (search) params.set('search', search)
  if (searchType) params.set('searchType', searchType)

  const cookie = await headers()
  const header = cookie.get('cookie')
  const res = await axios.get(`${process.env.NEXTAUTH_URL}/api/explore?${params}`, {
    headers: { Cookie: header },
  })
  const { quizSets, total } = res.data

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <ExploreTab
            initialQuizSets={quizSets}
            total={total}
            page={page}
            search={search}
            searchType={searchType}
          />
        </main>
      </div>
    </div>
  )
}