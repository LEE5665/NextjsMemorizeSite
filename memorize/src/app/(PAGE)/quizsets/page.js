'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
  defaultAnimateLayoutChanges,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableItem({ quiz }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: quiz.id,
    animateLayoutChanges: defaultAnimateLayoutChanges,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? 'transform 200ms ease',
    zIndex: isDragging ? 50 : 'auto',
    position: 'relative',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-[var(--input-bg)] text-[var(--text-color)] p-4 rounded shadow"
    >
      <h2 className="text-lg font-semibold">
        <Link href={`/quizsets/${quiz.id}`} className="hover:underline">
          {quiz.title}
        </Link>
      </h2>
      <div className="flex gap-2 mt-4">
        <Link
          href={`/quizsets/${quiz.id}`}
          className="text-sm bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white px-3 py-1 rounded"
        >
          시작
        </Link>
        <Link
          href={`/quizsets/edit/${quiz.id}`}
          className="text-sm bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white px-3 py-1 rounded"
        >
          수정
        </Link>
        <button
          onClick={async () => {
            if (confirm('정말 삭제할까요?')) {
              await axios.delete(`/api/quizsets/${quiz.id}`)
              location.reload()
            }
          }}
          className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          삭제
        </button>
      </div>
    </div>
  )
}

export default function QuizSetsPage() {
  const [quizSets, setQuizSets] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get('/api/quizsets')
      setQuizSets(res.data.sort((a, b) => a.order - b.order))
    }
    fetchData()
  }, [])

  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return

    const oldIndex = quizSets.findIndex(q => q.id === active.id)
    const newIndex = quizSets.findIndex(q => q.id === over.id)
    const newOrder = arrayMove(quizSets, oldIndex, newIndex)

    setQuizSets(newOrder)

    await axios.post('/api/quizsets/reorder', {
      newOrder: newOrder.map((q, i) => ({ id: q.id, order: i })),
    })
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">내 퀴즈 목록</h1>
        <div className="flex gap-2">
          <Link
            href="/quizsets/create"
            className="bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white px-4 py-2 rounded"
          >
            + 퀴즈 추가
          </Link>
          <button
            onClick={() => router.push('/quizsets/upload')}
            className="bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white px-4 py-2 rounded"
          >
            + 파일 업로드
          </button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={quizSets.map(q => q.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-4">
            {quizSets.map((quiz) => (
              <SortableItem key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
