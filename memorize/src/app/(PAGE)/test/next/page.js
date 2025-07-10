'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CounterPage() {
  const [count, setCount] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleQueryChange = () => {
    const current = new URLSearchParams(searchParams.toString())
    const nextPage = parseInt(current.get('page') || '1') + 1
    current.set('page', nextPage.toString())
    router.push(`?${current.toString()}`)
  }

  const handleRouteChange = () => {
    router.push('/test/next')
  }

  return (
    <div>
      <h1>라우트 & 쿼리스트링 이동 테스트</h1>
      <p>카운트: {count}</p>
      <p>현재 page 쿼리: {searchParams.get('page') || '1'}</p>

      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={handleQueryChange}>쿼리스트링 변경 (page 증가)</button>
      <button onClick={handleRouteChange}>다른 페이지로 이동</button>
    </div>
  )
}
