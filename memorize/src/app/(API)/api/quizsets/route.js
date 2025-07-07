import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/(API)/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: '로그인 필요' }, { status: 401 })

  const url = new URL(req.url)
  const sortParam = url.searchParams.get('sort') ?? 'createdAt'

  const allowedSorts = ['createdAt', 'updatedAt', 'title']
  const sort = allowedSorts.includes(sortParam) ? sortParam : 'createdAt'
  const direction = sort === 'title' ? 'asc' : 'desc'

  try {
    const quizSets = await prisma.quizSet.findMany({
      where: { creatorId: session.user.id },
      include: {
        questions: true,
        originalCreator: {
          select: { name: true },
        },
      },
      orderBy: { [sort]: direction },
    })

    const processed = quizSets.map((quiz) => ({
      ...quiz,
      displayCreator: quiz.originalCreator
        ? quiz.originalCreator.name
        : '본인',
    }))

    return NextResponse.json({ quizSets: processed })
  } catch (error) {
    console.error('퀴즈 불러오기 오류:', error)
    return NextResponse.json({ error: '서버 오류 발생' }, { status: 500 })
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  try {
    const { title, type, isPublic, questions } = await req.json()

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
    }

    const newQuizSet = await prisma.quizSet.create({
      data: {
        title,
        type: type ?? 'WORD',
        isPublic: !!isPublic,
        creatorId: session.user.id,
        questions: {
          create: questions.map((q) => ({
            content: q.content,
            answer: q.answer,
          })),
        },
      },
      include: {
        questions: true,
      },
    })

    return NextResponse.json({ message: '퀴즈 저장 완료', quizSet: newQuizSet }, { status: 201 })
  } catch (error) {
    console.error('퀴즈 생성 오류:', error)
    return NextResponse.json({ error: '서버 오류 발생' }, { status: 500 })
  }
}
