// app/main/page.js (서버 컴포넌트)
import Header from './components/Header' // 서버 컴포넌트
import TabClientWrapper from './components/TabClientWrapper' // CSR

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-color)] text-[var(--text-color)]">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <TabClientWrapper />
      </div>
    </div>
  )
}
