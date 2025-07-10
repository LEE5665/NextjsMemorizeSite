import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/(API)/api/auth/[...nextauth]/route'
import prisma from '@/app/libs/prismadb'

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: '로그인 필요' }, { status: 401 })

  const { name, quizSetIds = [] } = await req.json()

  if (!name || name.trim() === '') {
    return NextResponse.json({ error: '폴더 이름을 입력하세요.' }, { status: 400 })
  }

  try {
    const folder = await prisma.folder.create({
      data: {
        name: name.trim(),
        creatorId: session.user.id,
      },
    })

    if (quizSetIds.length > 0) {
      await prisma.quizSet.updateMany({
        where: { id: { in: quizSetIds }, creatorId: session.user.id },
        data: { folderId: folder.id },
      })
    }

    return NextResponse.json({ folder })
  } catch (error) {
    console.error('폴더 생성 오류:', error)
    return NextResponse.json({ error: '서버 오류 발생' }, { status: 500 })
  }
}

