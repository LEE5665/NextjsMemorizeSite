import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/(API)/api/auth/[...nextauth]/route'
import prisma from '@/app/libs/prismadb'

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

  // 파일 변환
  const buffer = Buffer.from(await file.arrayBuffer())
  const text = buffer.toString('utf-8')
  const title = file.name.replace(/\.txt$/i, '')

  // 문제 추출
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '')
  const questions = []

  let detectedType = null // 'WORD' | 'QA'
  for (let i = 0; i < lines.length; i += 2) {
    const l1 = lines[i]
    const l2 = lines[i + 1] || ''
    if (l1.startsWith('문제:') && l2.startsWith('답:')) {
      detectedType = 'QA'
      questions.push({
        content: l1.replace('문제:', '').trim(),
        answer: l2.replace('답:', '').trim(),
      })
    } else if (l1.startsWith('단어:') && l2.startsWith('뜻:')) {
      detectedType = 'WORD'
      questions.push({
        content: l1.replace('단어:', '').trim(),
        answer: l2.replace('뜻:', '').trim(),
      })
    }
  }

  if (questions.length === 0 || !detectedType) {
    return NextResponse.json({ error: '유효한 퀴즈 형식이 아닙니다.' }, { status: 400 })
  }

  // 업로드
  const newQuizSet = await prisma.quizSet.create({
    data: {
      title,
      type: detectedType, // "WORD" | "QA" (enum)
      creatorId: session.user.id,        // cuid (String)
      isPublic: false,
      questions: {
        create: questions,
      },
    },
    include: { questions: true },
  })

  return NextResponse.json(
    { message: '퀴즈 업로드 완료', quizSet: newQuizSet },
    { status: 201 }
  )
}
