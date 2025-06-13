import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  const quizSets = await prisma.quizSet.findMany({ orderBy: { id: 'desc' } })
  return Response.json(quizSets)
}

export async function POST(req) {
  const { title, description } = await req.json()
  const newSet = await prisma.quizSet.create({
    data: {
      title,
      description,
      creatorId: 1, // 임시 고정값
    },
  })
  return Response.json(newSet)
}
