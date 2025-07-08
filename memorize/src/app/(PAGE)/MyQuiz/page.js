import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import MyQuizTab from './components/Tab'
import { Suspense } from 'react'

export default async function MyQuizPage() {

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 bg-white dark:bg-zinc-900">
        <Sidebar />
        <main className="flex-1 p-8">
          <Suspense fallback={<div></div>}>
            <MyQuizTab />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
