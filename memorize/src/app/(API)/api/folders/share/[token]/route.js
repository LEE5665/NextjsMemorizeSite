import { jwtVerify } from 'jose'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/(API)/api/auth/[...nextauth]/route'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return redirect('/login')

  try {
    const secret = new TextEncoder().encode(process.env.FOLDER_SHARE_SECRET)
    const param = await params
    const { payload } = await jwtVerify(param.token, secret)
    const folderId = payload.folderId

    // 원본 폴더 및 퀴즈 가져오기
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: { quizSets: { include: { questions: true } } },
    })

    if (!folder) throw new Error('폴더 없음')
    const newFolder = await prisma.folder.create({
      data: {
        name: folder.name + ' [SHARE]',
        creatorId: session.user.id,
        quizSets: {
          create: folder.quizSets.map((qs) => ({
            title: qs.title,
            type: qs.type,
            isPublic: false,
            creatorId: session.user.id,
            questions: {
              create: qs.questions.map((q) => ({
                content: q.content,
                answer: q.answer,
              })),
            },
          })),
        },
      },
    })
    return NextResponse.json({
      ok: true,
      message: '폴더가 복사되었습니다.',
      redirectUrl: `/?tab=quiz&folder=${newFolder.id}`,
    })
  } catch (err) {
    console.error('공유 링크 오류:', err)
    return NextResponse.json({ error: '공유 실패 또는 토큰이 만료되었습니다.' }, { status: 400 })
  }
}
