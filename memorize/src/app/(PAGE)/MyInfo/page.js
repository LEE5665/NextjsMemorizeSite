import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import MyInfoTab from './Tab'

export default async function MyInfoPage() {

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 bg-white dark:bg-zinc-900">
        <Sidebar />
        <main className="flex-1 p-8">
          <MyInfoTab/>
        </main>
      </div>
    </div>
  )
}
