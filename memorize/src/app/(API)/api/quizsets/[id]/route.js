import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/(API)/api/auth/[...nextauth]/route'
const prisma = new PrismaClient()

export async function GET(req, { params }) {
  const id = Number(params.id)
  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id ?? null

  try {
    const quizSet = await prisma.quizSet.findUnique({
      where: { id },
      include: {
        questions: true,
        originalCreator: { select: { id: true } }, // 공유 여부 판단용
      },
    })

    if (!quizSet) {
      return NextResponse.json({ error: '해당 퀴즈셋이 존재하지 않습니다.' }, { status: 404 })
    }

    // 🔐 비공개 접근 제한
    if (!quizSet.isPublic && quizSet.creatorId !== currentUserId) {
      return NextResponse.json({ error: '접근 권한이 없습니다.' }, { status: 403 })
    }

    return NextResponse.json({
      ...quizSet,
      currentUserId,
      isSharedCopy: quizSet.originalCreatorId !== quizSet.creatorId, // 공유받은 퀴즈 여부 전달
    })
  } catch (err) {
    console.error('불러오기 오류:', err)
    return NextResponse.json({ error: '서버 오류 발생' }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }
  const param = await params
  const id = Number(param.id)

  try {
    await prisma.question.deleteMany({ where: { quizSetId: id } })
    await prisma.quizSet.delete({ where: { id } })

    return NextResponse.json({ message: '퀴즈 삭제 완료' })
  } catch (err) {
    console.error('삭제 오류:', err)
    return NextResponse.json({ error: '삭제 중 오류 발생' }, { status: 500 })
  }
}


export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const { id } = params
    const { title, type, isPublic, questions } = await req.json()

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
    }

    await prisma.question.deleteMany({ where: { quizSetId: Number(id) } })

    const updated = await prisma.quizSet.update({
      where: { id: Number(id), creatorId: session.user.id },
      data: {
        title,
        type: type ?? 'WORD',
        isPublic: !!isPublic,
        questions: {
          create: questions.map((q) => ({ content: q.content, answer: q.answer }))
        }
      },
      include: { questions: true }
    })

    return NextResponse.json({ message: '수정 완료', quizSet: updated })
  } catch (error) {
    console.error('퀴즈 수정 오류:', error)
    return NextResponse.json({ error: '서버 오류 발생' }, { status: 500 })
  }
}
