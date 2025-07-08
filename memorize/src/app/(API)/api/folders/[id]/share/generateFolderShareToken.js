import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.FOLDER_SHARE_SECRET)

/**
 * 폴더 공유 토큰 생성 (1시간 유효)
 * @param {number} folderId
 * @returns {Promise<string>}
 */
export async function generateFolderShareToken(folderId) {
  const token = await new SignJWT({ folderId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secret)

  return token
}

/**
 * 공유 토큰에서 폴더 ID 추출
 * @param {string} token
 * @returns {Promise<number>}
 */
export async function verifyFolderShareToken(token) {
  const { payload } = await jwtVerify(token, secret)

  if (!payload.folderId || typeof payload.folderId !== 'number') {
    throw new Error('유효하지 않은 토큰입니다.')
  }

  return payload.folderId
}
