import prisma from '@/app/libs/prismadb'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/(API)/api/auth/[...nextauth]/route'

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

    const param = await params
    const id = Number(param.id)
  const body = await req.json()

  try {
    const updated = await prisma.quizSet.update({
      where: { id },
      data: {
        progress: body, // { currentIndex, shuffledOrder, lastAnswer 등 }
      },
    })
    return NextResponse.json({ message: '진행 저장 완료', progress: updated.progress })
  } catch (err) {
    console.error('진행 저장 오류:', err)
    return NextResponse.json({ error: '저장 실패' }, { status: 500 })
  }
}
