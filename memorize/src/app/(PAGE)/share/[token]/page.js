'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import axios from 'axios'

export default function SharePage({ params }) {
  const router = useRouter()
  const { token } = use(params)

  useEffect(() => {
    async function handleShare() {
      try {
        const res = await axios.get(`/api/folders/share/${token}`)
        const data = res.data

        alert(data.message || '폴더가 복사되었습니다.')
        router.replace(data.redirectUrl)
      } catch (err) {
        const msg = err.response?.data?.error || '공유에 실패했습니다.'
        alert(msg)
        router.replace('/')
      }
    }

    handleShare()
  }, [token, router])

  return <p></p>
}
