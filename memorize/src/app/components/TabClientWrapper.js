'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Sidebar from './Sidebar'
import ExploreTab from './Tabs/ExploreTab'
import MyQuizTab from './Tabs/MyQuizTab'
import MyInfoTab from './Tabs/MyInfoTab'

export default function TabClientWrapper() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialTab = searchParams.get('tab') || 'explore'
  const [activeTab, setActiveTab] = useState(initialTab)

  useEffect(() => {
    // URL에 tab 파라미터 반영
    router.replace(`?tab=${activeTab}`)
  }, [activeTab, router])

  const renderTab = () => {
    switch (activeTab) {
      case 'explore':
        return <ExploreTab />
      case 'quiz':
        return <MyQuizTab />
      case 'me':
        return <MyInfoTab />
      default:
        return <p>존재하지 않는 탭입니다.</p>
    }
  }

  return (
    <div className="flex w-full">
      <Sidebar active={activeTab} setActive={setActiveTab} />
      <div className="flex-1 p-8 bg-white dark:bg-zinc-900 rounded-tl-lg shadow-inner">
        {renderTab()}
      </div>
    </div>
  )
}
