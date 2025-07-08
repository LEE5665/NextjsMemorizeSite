'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'

export default function MyInfoTab() {
  const { data: session, update } = useSession()
  const [user, setUser] = useState(null)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showNameEdit, setShowNameEdit] = useState(false)
  const [newName, setNewName] = useState('')
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get('/api/user')
      setUser(res.data)
      setNewName(res.data.name)
    }
    fetchUser()
  }, [])

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      alert('새 비밀번호가 일치하지 않습니다.')
      return
    }
    try {
      await axios.put('/api/user/password', { current: passwords.current, new: passwords.new })
      alert('비밀번호가 변경되었습니다.')
      setShowPasswordForm(false)
      setPasswords({ current: '', new: '', confirm: '' })
    } catch (err) {
      alert(err.response?.data?.error || '변경 실패')
    }
  }

  const handleUpdateName = async () => {
    try {
      await axios.put('/api/user/name', { name: newName })
      await update({ name: newName })
      location.reload()
      setUser((prev) => ({ ...prev, name: newName }))
      setShowNameEdit(false)
    } catch (err) {
      alert(err.response?.data?.error || '닉네임 변경 실패')
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('정말로 탈퇴하시겠습니까?')) return
    await axios.delete('/api/user')
    alert('탈퇴되었습니다.')
    location.reload()
  }

  if (!user) return <p className="p-6"></p>

  return (
    <div className="p-6 space-y-6 max-w-md">
      <h1 className="text-2xl font-bold">내 정보</h1>

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">아이디 (이메일)</label>
          <p className="text-zinc-700 dark:text-zinc-300">{user.email}</p>
        </div>

        <div>
          <label className="block font-medium mb-1">닉네임</label>
          {showNameEdit ? (
            <div className="flex gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border px-3 py-1 rounded flex-1"
              />
              <button onClick={handleUpdateName} className="bg-blue-600 text-white px-3 py-1 rounded">저장</button>
              <button onClick={() => setShowNameEdit(false)} className="text-gray-500 px-2">취소</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span>{user.name}</span>
              <button onClick={() => setShowNameEdit(true)} className="text-blue-600 text-sm underline">수정</button>
            </div>
          )}
        </div>
        {user.password && (
          <div>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="text-blue-600 text-sm underline"
            >
              비밀번호 변경
            </button>
            {showPasswordForm && (
              <div className="space-y-2 mt-2">
                <input
                  type="password"
                  placeholder="현재 비밀번호"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="password"
                  placeholder="새 비밀번호"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="password"
                  placeholder="새 비밀번호 확인"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
                <button
                  onClick={handleChangePassword}
                  className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                >
                  변경하기
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <hr />

      <button
        onClick={handleDeleteAccount}
        className="text-red-600 underline"
      >
        회원 탈퇴
      </button>
    </div>
  )
}
