import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import MyQuizTab from './components/Tab'
import { headers } from 'next/headers'
import axios from 'axios'

export const dynamic = 'force-dynamic'

export default async function MyQuizPage({ searchParams }) {
  const param = await searchParams
  const sort = param?.sort || 'updatedAt'
  const folderSort = param?.folderSort || 'updatedAt'
  const folderId = param?.folder
  const search = param.search || ''

  const cookie = await headers()
  const header = cookie.get('cookie')
  const params = new URLSearchParams()
  params.set('sort', sort)
  params.set('folderSort', folderSort)
  if (search) {
    params.set('search', search)
  } else if (folderId) {
    params.set('folder', folderId)
  }
  const res = await axios.get(
    `${process.env.NEXTAUTH_URL}/api/quizsets?${params.toString()}`,
    { headers: { Cookie: header } }
  )
  const quizSets = res.data.quizSets
  const folders = res.data.folders
  const groupedQuizSets = res.data.groupedQuizSets


  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
            <MyQuizTab
            quizSets={quizSets}
            folders={folders}
            groupedQuizSets={groupedQuizSets}
            initialSort={sort}
            initialFolderSort={folderSort}
            initialFolderId={folderId}
          />
        </main>
      </div>
    </div>
  )
}
