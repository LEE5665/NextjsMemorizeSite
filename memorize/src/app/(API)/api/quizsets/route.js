import prisma from '@/app/libs/prismadb'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/(API)/api/auth/[...nextauth]/route'

export async function GET(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: '로그인 필요' }, { status: 401 })

  const url = new URL(req.url)
  const sortParam = url.searchParams.get('sort') ?? 'createdAt'
  const folderParam = url.searchParams.get('folder')
  const folderSortParam = url.searchParams.get('folderSort') ?? 'createdAt'
  const search = url.searchParams.get('search')?.trim() || ''

  const allowedSorts = ['createdAt', 'updatedAt', 'title']
  const sort = allowedSorts.includes(sortParam) ? sortParam : 'createdAt'
  const direction = sort === 'title' ? 'asc' : 'desc'

  const allowedFolderSorts = ['createdAt', 'updatedAt', 'name']
  const folderSort = allowedFolderSorts.includes(folderSortParam) ? folderSortParam : 'createdAt'
  const folderDir = folderSort === 'name' ? 'asc' : 'desc'

  try {
    let whereClause = { creatorId: session.user.id }
    // 폴더 필터: 검색 없으면 적용, 검색 있으면 전체 검색
    if (!search) {
      if (folderParam) whereClause.folderId = parseInt(folderParam)
      else whereClause.folderId = null
    }
    // 검색: 제목만, 폴더 상관없이 전체 내 퀴즈 검색
    if (search) {
      whereClause = {
        creatorId: session.user.id,
        title: { contains: search },
      }
    }

    const [quizSets, folders] = await Promise.all([
      prisma.quizSet.findMany({
        where: whereClause,
        include: {
          questions: true,
          folder: true,
        },
        orderBy: { [sort]: direction },
      }),
      prisma.folder.findMany({
        where: { creatorId: session.user.id },
        orderBy: { [folderSort]: folderDir },
        include: {
          _count: {
            select: { quizSets: true },
          },
        },
      }),
    ])

    return NextResponse.json({ quizSets, folders })
  } catch (error) {
    console.error('퀴즈 불러오기 오류:', error)
    return NextResponse.json({ error: '서버 오류 발생' }, { status: 500 })
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  try {
    const { title, type, isPublic, questions, folderId } = await req.json()

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
    }

    const newQuizSet = await prisma.quizSet.create({
      data: {
        title,
        type: type ?? 'WORD',
        isPublic: !!isPublic,
        creatorId: session.user.id,
        folderId: folderId ?? null, // 📌 폴더 지정이 없으면 null
        questions: {
          create: questions.map((q) => ({
            content: q.content,
            answer: q.answer,
          })),
        },
      },
      include: {
        questions: true,
        folder: true,
      },
    })

    return NextResponse.json({ message: '퀴즈 저장 완료', quizSet: newQuizSet }, { status: 201 })
  } catch (error) {
    console.error('퀴즈 생성 오류:', error)
    return NextResponse.json({ error: '서버 오류 발생' }, { status: 500 })
  }
}
