// /app/api/explore/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const quizSets = await prisma.quizSet.findMany({
      where: {
        isPublic: true,
      },
      include: {
        creator: {
          select: { name: true },
        },
        questions: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const result = quizSets.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      questionCount: quiz.questions.length,
      creatorName: quiz.creator.name,
      createdAt: quiz.createdAt,
    }))

    return NextResponse.json({ quizSets: result })
  } catch (error) {
    console.error('공개 퀴즈 불러오기 오류:', error)
    return NextResponse.json({ error: '서버 오류 발생' }, { status: 500 })
  }
}
