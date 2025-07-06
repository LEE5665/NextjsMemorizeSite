import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/(API)/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const { newOrder } = await req.json() // [{id: 1, order: 0}, {id: 3, order: 1}, ...]

  try {
    const updatePromises = newOrder.map((item) =>
      prisma.quizSet.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    )

    await Promise.all(updatePromises)
    return NextResponse.json({ message: '정렬 순서 저장 완료' })
  } catch (err) {
    return NextResponse.json({ error: '정렬 업데이트 실패' }, { status: 500 })
  }
}
