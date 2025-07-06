import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/(API)/api/auth/[...nextauth]/route'
const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)
  const quizSets = await prisma.quizSet.findMany({
  where: { creatorId: session.user.id },
  orderBy: { order: 'asc' },
  include: { questions: true },
})
  return Response.json(quizSets)
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const { title, questions } = await req.json()

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
    }

    const maxOrderQuiz = await prisma.quizSet.findFirst({
  where: { creatorId: session.user.id },
  orderBy: { order: 'desc' },
})

const newOrder = maxOrderQuiz ? maxOrderQuiz.order + 1 : 0

const newQuizSet = await prisma.quizSet.create({
  data: {
    title,
    creatorId: session.user.id,
    order: newOrder,
    questions: {
      create: questions.map((q) => ({
        content: q.content,
        answer: q.answer,
      })),
    },
  },
})

    return NextResponse.json({ message: '퀴즈 저장 완료', quizSet: newQuizSet }, { status: 201 })
  } catch (error) {
    console.error('퀴즈 생성 오류:', error)
    return NextResponse.json({ error: '서버 오류 발생' }, { status: 500 })
  }
}