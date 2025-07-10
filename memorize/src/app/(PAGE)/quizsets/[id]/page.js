import Header from '../../../components/Header'
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <View quizSet={quizSet} />
      </main>
    </div>
  )
}