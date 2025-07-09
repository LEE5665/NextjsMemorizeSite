// app/myinfo/page.tsx (서버 컴포넌트)

import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import MyInfoTab from './Tab'
import { headers } from 'next/headers'
import axios from 'axios'

export const dynamic = 'force-dynamic'

export default async function MyInfoPage() {
  const cookie = await headers()
  const header = cookie.get('cookie')
  const res = await axios.get(`${process.env.NEXTAUTH_URL}/api/user`, {
    headers: { Cookie: header },
  })
  const user = res.data

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 bg-white dark:bg-zinc-900">
        <Sidebar />
        <main className="flex-1 p-8">
          <MyInfoTab initialUser={user} />
        </main>
      </div>
    </div>
  )
}
