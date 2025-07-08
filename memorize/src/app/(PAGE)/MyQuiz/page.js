// app/myquiz/page.tsx
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import MyQuizTab from './Tab'
import axios from 'axios'

export default async function MyQuizPage({ searchParams }) {
  const baseURL = process.env.NEXTAUTH_URL
  const sort = searchParams?.sort ?? 'updatedAt'
  const folderSort = searchParams?.folderSort ?? 'updatedAt'
  const folderId = searchParams?.folder ?? ''
  const res = await axios.get(`${baseURL}/api/quizsets?sort=${sort}&folder=${folderId}&folderSort=${folderSort}`)
  const quizSets = res.data.quizSets
  const folders = res.data.folders

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 bg-black">
        <Sidebar />
        <main className="flex-1 p-8">
          <MyQuizTab initialQuizSets={quizSets} initialFolders={folders} />
        </main>
      </div>
    </div>
  )
}
