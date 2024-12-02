import { u8 } from '@fuman/utils'

export function readStoredSecret() {
    return localStorage.getItem('secret') ?? null
}

export async function prepareSecret(secret: string): Promise<CryptoKey> {
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret))
    return await crypto.subtle.importKey('raw', hash, {
        name: 'AES-CBC',
        length: 256,
    }, false, ['encrypt', 'decrypt'])
}

export async function encryptBlob(bytes: Uint8Array, secret: CryptoKey) {
    const iv = crypto.getRandomValues(new Uint8Array(16))
    const encrypted = await crypto.subtle.encrypt(
        {
            name: 'AES-CBC',
            iv,
        },
        secret,
        bytes,
    )
    return u8.concat2(iv, new Uint8Array(encrypted))
}

export async function decryptBlob(encrypted: Uint8Array, secret: CryptoKey): Promise<Uint8Array> {
    const iv = encrypted.slice(0, 16)
    const encryptedData = encrypted.slice(16)
    return new Uint8Array(await crypto.subtle.decrypt(
        {
            name: 'AES-CBC',
            iv,
        },
        secret,
        encryptedData,
    ))
}
