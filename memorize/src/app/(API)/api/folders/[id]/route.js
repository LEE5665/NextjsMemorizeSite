import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/app/(API)/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET(_, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: '로그인 필요' }, { status: 401 })

  const param = await params
  const folderId = parseInt(param.id)

  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
      creatorId: session.user.id,
    },
    select: {
      id: true,
      name: true,
    },
  })

  if (!folder) {
    return NextResponse.json({ error: '폴더를 찾을 수 없습니다.' }, { status: 404 })
  }

  const inFolder = await prisma.quizSet.findMany({
    where: { folderId: folderId, creatorId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, title: true },
  })

  const notInFolder = await prisma.quizSet.findMany({
    where: { folderId: null, creatorId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, title: true },
  })

  return NextResponse.json({ folder, inFolder, notInFolder })
}

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: '로그인 필요' }, { status: 401 })

  const param = await params
  const folderId = parseInt(param.id)
  const { name, quizSetIds = [] } = await req.json()

  if (!name || name.trim() === '') {
    return NextResponse.json({ error: '폴더 이름을 입력하세요.' }, { status: 400 })
  }

  try {
    const updated = await prisma.folder.updateMany({
      where: { id: folderId, creatorId: session.user.id },
      data: { name: name.trim() },
    })

    if (updated.count === 0) {
      return NextResponse.json({ error: '수정 권한이 없습니다.' }, { status: 403 })
    }

    // 기존 폴더 연결 제거
    await prisma.quizSet.updateMany({
      where: { folderId, creatorId: session.user.id },
      data: { folderId: null },
    })

    // 새로 선택된 퀴즈 연결
    if (quizSetIds.length > 0) {
      await prisma.quizSet.updateMany({
        where: { id: { in: quizSetIds }, creatorId: session.user.id },
        data: { folderId },
      })
    }

    return NextResponse.json({ message: '폴더 수정 완료' })
  } catch (error) {
    console.error('폴더 수정 오류:', error)
    return NextResponse.json({ error: '서버 오류 발생' }, { status: 500 })
  }
}

export async function DELETE(_, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: '로그인 필요' }, { status: 401 })

  const param = await params
  const folderId = parseInt(param.id)

  try {
    await prisma.quizSet.deleteMany({
      where: { folderId, creatorId: session.user.id },
    })

    const deleted = await prisma.folder.deleteMany({
      where: { id: folderId, creatorId: session.user.id },
    })

    if (deleted.count === 0) {
      return NextResponse.json({ error: '삭제 권한이 없습니다.' }, { status: 403 })
    }

    return NextResponse.json({ message: '폴더 및 퀴즈 삭제 완료' })
  } catch (error) {
    console.error('폴더 삭제 오류:', error)
    return NextResponse.json({ error: '서버 오류 발생' }, { status: 500 })
  }
}

// 퀴즈들 폴더만 제거하는건데 다 제거하는거로 일단
// export async function DELETE(_, { params }) {
//   const session = await getServerSession(authOptions)
//   if (!session) return NextResponse.json({ error: '로그인 필요' }, { status: 401 })

//   const param = await params
//   const folderId = parseInt(param.id)

//   try {
//     await prisma.quizSet.updateMany({
//       where: { folderId, creatorId: session.user.id },
//       data: { folderId: null },
//     })

//     const deleted = await prisma.folder.deleteMany({
//       where: { id: folderId, creatorId: session.user.id },
//     })

//     if (deleted.count === 0) {
//       return NextResponse.json({ error: '삭제 권한이 없습니다.' }, { status: 403 })
//     }

//     return NextResponse.json({ message: '폴더 삭제 완료' })
//   } catch (error) {
//     console.error('폴더 삭제 오류:', error)
//     return NextResponse.json({ error: '서버 오류 발생' }, { status: 500 })
//   }
// }
