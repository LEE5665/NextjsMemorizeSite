import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/(API)/api/auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file')

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const text = buffer.toString('utf-8')
  const title = file.name.replace('.txt', '')

  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '')
  const questions = []

  for (let i = 0; i < lines.length; i += 2) {
    if (lines[i].startsWith('문제:') && lines[i + 1]?.startsWith('답:')) {
      questions.push({
        content: lines[i].replace('문제:', '').trim(),
        answer: lines[i + 1].replace('답:', '').trim(),
      })
    }
  }

  if (questions.length === 0) {
    return NextResponse.json({ error: '유효한 퀴즈 형식이 아닙니다.' }, { status: 400 })
  }

  const newQuizSet = await prisma.quizSet.create({
    data: {
      title,
      creatorId: session.user.id,
      questions: {
        create: questions,
      },
    },
  })

  return NextResponse.json({ message: '퀴즈 업로드 완료', quizSet: newQuizSet }, { status: 201 })
}
