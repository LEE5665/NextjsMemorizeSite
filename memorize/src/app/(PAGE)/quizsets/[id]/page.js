import Header from '../../../components/Header' // 서버 컴포넌트
import View from './components/View' // CSR

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-color)] text-[var(--text-color)]">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <View />
      </main>
    </div>
  )
}
