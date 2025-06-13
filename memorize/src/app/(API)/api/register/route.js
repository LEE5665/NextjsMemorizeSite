// app/api/register/route.js
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient();

export async function POST(req) {
  const { email, name, password } = await req.json()

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return NextResponse.json({ error: '이미 존재하는 이메일입니다.' }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  })

  return NextResponse.json({ message: '회원가입 완료', user })
}
