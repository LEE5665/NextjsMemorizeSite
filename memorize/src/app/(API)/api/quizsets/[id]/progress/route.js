import prisma from '@/app/libs/prismadb'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/(API)/api/auth/[...nextauth]/route'

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }
  const userId = session.user.id
  const param = await params
  const id = Number(param.id)
  const url = new URL(req.url)
  const type = url.searchParams.get('type')
  const body = await req.json()

  if (!type) {
    return NextResponse.json({ error: 'type 파라미터가 필요합니다.' }, { status: 400 })
  }

  try {
    const progress = await prisma.quizProgress.upsert({
      where: { userId_quizSetId_type: { userId, quizSetId: id, type } },
      update: { data: body },
      create: {
        userId,
        quizSetId: id,
        type,
        data: body
      }
    })
    return NextResponse.json({ message: '진행 저장 완료', progress })
  } catch (err) {
    console.error('진행 저장 오류:', err)
    return NextResponse.json({ error: '저장 실패' }, { status: 500 })
  }
}

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }
  const userId = session.user.id
  const param = await params
  const id = Number(param.id)

  try {
    const progresses = await prisma.quizProgress.findMany({
      where: { userId, quizSetId: id }
    })
    // { type: ..., data: ... }[] 배열
    return NextResponse.json({ progresses })
  } catch (err) {
    return NextResponse.json({ error: '조회 실패' }, { status: 500 })
  }
}
