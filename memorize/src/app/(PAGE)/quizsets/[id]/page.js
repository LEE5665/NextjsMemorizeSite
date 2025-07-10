import Header from '../../../components/Header'
import Sidebar from '../../../components/Sidebar'
import View from './components/View'
import axios from 'axios'
import { headers } from 'next/headers'

export default async function QuizViewServerPage({ params }) {
  const param = await params
  const { id } = param

  const cookie = await headers()
  const header = cookie.get('cookie')
  const res = await axios.get(`${process.env.NEXTAUTH_URL}/api/quizsets/${id}`, {
    headers: { Cookie: header },
  })
  const quizSet = res.data
  const currentUserId = res.data.currentUserId
  let progresses = {}
  try {
    const progRes = await axios.get(`${process.env.NEXTAUTH_URL}/api/quizsets/${id}/progress`, {
      headers: { Cookie: header },
    })
    
    for (const p of progRes.data.progresses) progresses[p.type] = p.data
  } catch {
    progresses = {}
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <View quizSet={quizSet} progresses={progresses} currentUserId={currentUserId} />
        </main>
      </div>
    </div>
  )
}