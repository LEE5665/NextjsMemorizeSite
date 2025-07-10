import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 12
  const skip = (page - 1) * limit
  const search = searchParams.get('search')?.trim() || ''
  const searchType = searchParams.get('searchType') || 'all' // 추가

  let filter = { isPublic: true }

  if (search) {
    if (searchType === 'title') {
      filter = {
        ...filter,
        title: { contains: search }
      }
    } else if (searchType === 'creator') {
      filter = {
        ...filter,
        creator: { name: { contains: search } }
      }
    } else {
      filter = {
        ...filter,
        OR: [
          { title: { contains: search } },
          { creator: { name: { contains: search } } }
        ]
      }
    }
  }

  try {
    const [total, quizSets] = await Promise.all([
      prisma.quizSet.count({ where: filter }),
      prisma.quizSet.findMany({
        where: filter,
        include: {
          creator: { select: { name: true } },
          questions: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      })
    ])

    const result = quizSets.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      questionCount: quiz.questions.length,
      creatorName: quiz.creator.name,
      createdAt: quiz.createdAt,
      type: quiz.type
    }))

    return NextResponse.json({ quizSets: result, total })
  } catch (error) {
    console.error('공개 퀴즈 불러오기 오류:', error)
    return NextResponse.json({ error: '서버 오류 발생' }, { status: 500 })
  }
}
