// src/app/(API)/api/quizsets/[id]/progress/route.js
import prisma from '@/app/libs/prismadb'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/(API)/api/auth/[...nextauth]/route'

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  // params는 async context에서 await해야함
  const param = await params
  const id = Number(param.id)
  const url = new URL(req.url)
  const type = url.searchParams.get('type') // CHOICE, SHORT, REVERSE_CHOICE, REVERSE_SHORT 등
  const body = await req.json()

  if (!type) {
    return NextResponse.json({ error: 'type 파라미터가 필요합니다.' }, { status: 400 })
  }

  try {
    // 현재 저장된 진행도 불러오기
    const quizSet = await prisma.quizSet.findUnique({ where: { id } })
    const prevProgress = quizSet.progress || {}

    // type별로 따로 저장
    const newProgress = { ...prevProgress, [type]: body }

    // 저장
    const updated = await prisma.quizSet.update({
      where: { id },
      data: { progress: newProgress }
    })
    return NextResponse.json({ message: '진행 저장 완료', progress: updated.progress })
  } catch (err) {
    console.error('진행 저장 오류:', err)
    return NextResponse.json({ error: '저장 실패' }, { status: 500 })
  }
}
