import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/(API)/api/auth/[...nextauth]/route'
const prisma = new PrismaClient()

export async function GET(req, { params }) {
    const param = await params
    const id = Number(param.id)

  try {
    const quizSet = await prisma.quizSet.findUnique({
      where: { id },
      include: { questions: true }, // ✅ 문제들 포함해서 가져옴
    })

    if (!quizSet) {
      return NextResponse.json({ error: '해당 퀴즈셋이 존재하지 않습니다.' }, { status: 404 })
    }

    return NextResponse.json(quizSet)
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
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const param = await params
  const id = Number(param.id)
  const { title, questions } = await req.json()

  if (!title || !Array.isArray(questions) || questions.length === 0) {
    return NextResponse.json({ error: '입력값이 유효하지 않습니다.' }, { status: 400 })
  }

  try {
    await prisma.question.deleteMany({ where: { quizSetId: id } })

    const updatedQuiz = await prisma.quizSet.update({
      where: { id },
      data: {
        title,
        questions: {
          create: questions.map((q) => ({
            content: q.content,
            answer: q.answer,
          })),
        },
      },
    })

    return NextResponse.json({ message: '퀴즈 수정 완료', quizSet: updatedQuiz })
  } catch (err) {
    console.error('수정 오류:', err)
    return NextResponse.json({ error: '수정 중 오류 발생' }, { status: 500 })
  }
}

