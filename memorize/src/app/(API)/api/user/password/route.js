import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/(API)/api/auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function PUT(req) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response(JSON.stringify({ error: '로그인이 필요합니다.' }), { status: 401 })
  }

  const { current, new: newPassword } = await req.json()

  if (!current || !newPassword) {
    return new Response(JSON.stringify({ error: '비밀번호를 모두 입력하세요.' }), { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  const match = await bcrypt.compare(current, user.password)
  if (!match) {
    return new Response(JSON.stringify({ error: '현재 비밀번호가 틀렸습니다.' }), { status: 400 })
  }

  const hashed = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashed },
  })

  return new Response(JSON.stringify({ message: '비밀번호가 변경되었습니다.' }), { status: 200 })
}
