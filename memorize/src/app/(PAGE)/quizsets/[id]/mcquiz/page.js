import Header from '@/app/components/Header' // 서버 컴포넌트
import Sidebar from '@/app/components/Sidebar' // 서버 컴포넌트
import View from './View' // CSR

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <View />
        </main>
      </div>
    </div>
  )
}
