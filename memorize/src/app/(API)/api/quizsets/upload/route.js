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

  const buffer = Buffer.from(await file.arrayBuffer())
  const text = buffer.toString('utf-8')

  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '')

  let quizSets = [] // 여러 퀴즈셋 저장
  let currentTitle = null
  let currentQuestions = []
  let detectedType = null // 'WORD' | 'QA'
  const uploadResults = []

  function pushCurrentQuizSet() {
    if (currentTitle && currentQuestions.length > 0 && detectedType) {
      quizSets.push({
        title: currentTitle,
        type: detectedType,
        questions: [...currentQuestions],
      })
    }
    // 초기화
    currentTitle = null
    currentQuestions = []
    detectedType = null
  }

  for (let i = 0; i < lines.length;) {
    const line = lines[i]

    if (line.startsWith('제목:')) {
      // 이전 퀴즈셋 저장
      pushCurrentQuizSet()
      currentTitle = line.replace('제목:', '').trim()
      i++
    } else if (line.startsWith('단어:') && lines[i+1]?.startsWith('뜻:')) {
      if (!detectedType) detectedType = 'WORD'
      currentQuestions.push({
        content: lines[i].replace('단어:', '').trim(),
        answer: lines[i+1].replace('뜻:', '').trim(),
      })
      i += 2
    } else if (line.startsWith('문제:') && lines[i+1]?.startsWith('답:')) {
      if (!detectedType) detectedType = 'QA'
      currentQuestions.push({
        content: lines[i].replace('문제:', '').trim(),
        answer: lines[i+1].replace('답:', '').trim(),
      })
      i += 2
    } else {
      // 그 외 줄은 건너뜀
      i++
    }
  }
  // 마지막 퀴즈셋 저장
  pushCurrentQuizSet()

  if (quizSets.length === 0) {
    return NextResponse.json({ error: '유효한 퀴즈 형식이 아닙니다.' }, { status: 400 })
  }

  // DB에 퀴즈셋들 저장 (순차적 업로드)
  for (const qs of quizSets) {
    const newQuizSet = await prisma.quizSet.create({
      data: {
        title: qs.title,
        type: qs.type,
        creatorId: session.user.id,
        isPublic: false,
        questions: { create: qs.questions },
      },
      include: { questions: true },
    })
    uploadResults.push(newQuizSet)
  }

  return NextResponse.json(
    { message: `${uploadResults.length}개의 퀴즈 업로드 완료`, quizSets: uploadResults },
    { status: 201 }
  )
}
