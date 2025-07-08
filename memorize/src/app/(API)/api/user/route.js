// /app/api/user/route.js

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/(API)/api/auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/user - 현재 로그인한 유저 정보 반환
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: '로그인 필요' }, { status: 401 })

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, name: true, password: true },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('유저 정보 조회 실패:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}

// DELETE /api/user - 현재 로그인한 유저 삭제
export async function DELETE() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: '로그인 필요' }, { status: 401 })

  try {
    await prisma.user.delete({
      where: { id: session.user.id },
    })

    return NextResponse.json({ message: '회원탈퇴 완료' })
  } catch (error) {
    console.error('회원탈퇴 실패:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}