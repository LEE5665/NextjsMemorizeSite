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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.38)] modal-overlay-fade">
      <div
        ref={modalRef}
        className="w-full max-w-md p-7 rounded-2xl shadow-2xl border bg-[var(--bg-color)] text-[var(--text-color)] border-[var(--border-color)] animate-modal-pop"
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold">공유 링크</h2>
          <button onClick={onClose} className="text-xl text-[var(--subtext-color)] hover:text-red-500 transition">
            <X size={22} />
          </button>
        </div>

        <div className="mb-5">
          <input
            type="text"
            readOnly
            value={url}
            className="w-full px-3 py-3 rounded-xl bg-[var(--input-bg)] text-[var(--text-color)] border border-[var(--border-color)] font-mono text-sm focus:outline-none select-all"
            onFocus={e => e.target.select()}
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={onCopy}
            className={`px-5 py-2 rounded-lg font-bold shadow-sm transition
              bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-[var(--button-text)]
              ${copied ? 'opacity-80 pointer-events-none' : ''}`}
          >
            {copied ? '복사됨' : '복사하기'}
          </button>
        </div>
      </div>

      {/* 애니메이션 */}
      <style jsx>{`
        .animate-modal-pop {
          animation: modal-pop .23s cubic-bezier(.42,1.1,.23,1);
        }
        @keyframes modal-pop {
          0% { opacity: 0; transform: scale(.95);}
          100% { opacity: 1; transform: scale(1);}
        }
        .modal-overlay-fade {
          animation: overlay-fade .15s cubic-bezier(.42,1.1,.23,1);
        }
        @keyframes overlay-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
