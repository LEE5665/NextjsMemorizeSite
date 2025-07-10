'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'

export default function MyInfoTab({ initialUser }) {
  const { update } = useSession()
  const [user, setUser] = useState(initialUser)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showNameEdit, setShowNameEdit] = useState(false)
  const [newName, setNewName] = useState(initialUser.name)
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      alert('새 비밀번호가 일치하지 않습니다.')
      return
    }
    try {
      await axios.put('/api/user/password', {
        current: passwords.current,
        new: passwords.new,
      })
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
      setUser((prev) => ({ ...prev, name: newName }))
      setShowNameEdit(false)
      location.reload()
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

  return (
    <div className="max-w-xl mx-auto p-6 bg-[--bg-color] border border-[--border-color] rounded-xl shadow space-y-8">
      <h1 className="text-2xl font-bold text-[--text-color]">내 정보</h1>

      {/* 이메일 */}
      <div>
        <label className="block text-sm font-semibold mb-1 text-[--text-color]">이메일</label>
        <div className="text-sm text-[--text-color]">{user.email}</div>
      </div>

      {/* 닉네임 */}
      <div>
        <label className="block text-sm font-semibold mb-1 text-[--text-color]">닉네임</label>
        {showNameEdit ? (
          <div className="flex gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 px-3 py-2 rounded-md border border-[--border-color] bg-[--input-bg] text-[--text-color] placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[--button-bg]"
            />
            <button
              onClick={handleUpdateName}
              className="bg-[--button-bg] hover:bg-[--button-hover-bg] text-[--button-text] text-sm px-4 py-2 rounded-md shadow transition"
            >
              저장
            </button>
            <button
              onClick={() => setShowNameEdit(false)}
              className="text-sm text-[--action-text] hover:text-[--action-hover] px-2"
            >
              취소
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-[--text-color]">{user.name}</span>
            <button
              onClick={() => setShowNameEdit(true)}
              className="text-xs text-[--action-text] hover:text-[--action-hover] underline"
            >
              수정
            </button>
          </div>
        )}
      </div>

      {/* 비밀번호 변경 */}
      {user.password && (
        <div className="space-y-3">
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="text-sm text-[--action-text] hover:text-[--action-hover] underline"
          >
            비밀번호 변경
          </button>

          {showPasswordForm && (
            <div className="space-y-3">
              <input
                type="password"
                placeholder="현재 비밀번호"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-[--border-color] bg-[--input-bg] text-[--text-color] placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[--button-bg]"
              />
              <input
                type="password"
                placeholder="새 비밀번호"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-[--border-color] bg-[--input-bg] text-[--text-color] placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[--button-bg]"
              />
              <input
                type="password"
                placeholder="새 비밀번호 확인"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-[--border-color] bg-[--input-bg] text-[--text-color] placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[--button-bg]"
              />
              <button
                onClick={handleChangePassword}
                className="w-full px-4 py-2 rounded-md bg-[--button-bg] hover:bg-[--button-hover-bg] text-white font-semibold shadow transition"
              >
                변경하기
              </button>
            </div>
          )}
        </div>
      )}

      <hr className="border-[--border-color]" />

      {/* 회원 탈퇴 */}
      <div>
        <button
          onClick={handleDeleteAccount}
          className="text-sm text-[--danger-text] hover:text-[--danger-hover] underline"
        >
          회원 탈퇴
        </button>
      </div>
    </div>
  )
}
