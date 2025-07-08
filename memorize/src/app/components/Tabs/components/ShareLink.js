'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export default function ShareLinkModal({ url, onClose, onCopy, copied }) {
  const modalRef = useRef()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 w-11/12 max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[var(--text-color)]">공유 링크</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            <X size={20} />
          </button>
        </div>
        <div className="mb-4">
          <input
            type="text"
            readOnly
            value={url}
            className="w-full px-3 py-2 border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-color)] rounded"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={onCopy}
            className="bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white px-4 py-2 rounded"
          >
            {copied ? '복사됨' : '복사하기'}
          </button>
        </div>
      </div>
    </div>
  )
}