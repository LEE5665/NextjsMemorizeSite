import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/(API)/api/auth/[...nextauth]/route'
import { generateFolderShareToken } from './generateFolderShareToken'
import { NextResponse } from 'next/server'

export async function POST(req, { params }) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const param = await params
    const folderId = parseInt(param.id, 10)
    if (isNaN(folderId)) {
        return NextResponse.json({ error: '유효하지 않은 폴더 ID' }, { status: 400 })
    }

    try {
        const token = await generateFolderShareToken(folderId)
        const url = `${process.env.NEXTAUTH_URL}/share/${token}`
        return NextResponse.json({ url })
    } catch (err) {
        console.error('공유 토큰 생성 오류:', err)
        return NextResponse.json({ error: '공유 링크 생성 실패' }, { status: 500 })
    }
}
