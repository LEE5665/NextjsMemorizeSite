// /app/api/explore/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const quizSets = await prisma.quizSet.findMany({
    where: {
      isPublic: true,
    },
    include: {
      creator: true,
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
    creatorName: quiz.originalCreatorName || quiz.creator.name,
    createdAt: quiz.createdAt,
  }))

  return NextResponse.json({ quizSets: result })
}
