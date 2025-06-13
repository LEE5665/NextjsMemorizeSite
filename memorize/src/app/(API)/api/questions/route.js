import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const quizSetId = Number(searchParams.get('quizSetId'))

  const questions = await prisma.question.findMany({
    where: { quizSetId },
    orderBy: { createdAt: 'asc' },
  })

  return Response.json(questions)
}
