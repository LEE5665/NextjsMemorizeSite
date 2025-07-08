import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/(API)/api/auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(req) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response(JSON.stringify({ error: '로그인이 필요합니다.' }), { status: 401 })
  }

  const { name } = await req.json()

  if (!name || name.length < 2) {
    return new Response(JSON.stringify({ error: '닉네임은 2자 이상이어야 합니다.' }), { status: 400 })
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name },
  })

  return new Response(JSON.stringify({ message: '닉네임이 변경되었습니다.' }), { status: 200 })
}
