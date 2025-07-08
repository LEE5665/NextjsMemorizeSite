import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/(API)/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id

  if (!currentUserId) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const id = Number(params.id)

  const original = await prisma.quizSet.findUnique({
    where: { id },
    include: {
      questions: true,
    },
  })

  if (!original || !original.isPublic) {
    return NextResponse.json({ error: '공유 가능한 퀴즈가 아닙니다.' }, { status: 400 })
  }

  const copied = await prisma.quizSet.create({
    data: {
      title: original.title + ' [SHARED]',
      type: original.type,
      creatorId: currentUserId,
      isPublic: false,
      questions: {
        create: original.questions.map(q => ({
          content: q.content,
          answer: q.answer,
        })),
      },
    },
  })

  return NextResponse.json({ message: '공유 완료', quizSet: copied }, { status: 201 })
}
