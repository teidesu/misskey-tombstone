import type { Note } from '../data.ts'
import { webcrypto } from 'node:crypto'
import * as fsp from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { base64, parallelMap, utf8 } from '@fuman/utils'
import { encryptBlob, prepareSecret } from '../crypto.ts'

import { getFileExtension } from '../utils.ts'
import 'dotenv/config'

Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
})

const notes = (await import('../../data/notes-ext.json')).default as any as Note[]

const DATA_DIR = fileURLToPath(new URL('../../data', import.meta.url))
const PUBLIC_DIR = fileURLToPath(new URL('../../public', import.meta.url))

await fsp.mkdir(join(PUBLIC_DIR, 'files'), { recursive: true })

const secret = await prepareSecret(process.env.PRIVATE_POSTS_SECRET!)

const publicNotes = await parallelMap(notes, async (note) => {
    if (!note || note.visibility === 'specified') return
    const isPrivate = note.visibility === 'followers'

    if (note.files.length > 0) {
        for (const file of note.files) {
            const filePath = `${file.id}.${getFileExtension(file.type)}`
            if (await fsp.stat(`${DATA_DIR}/files/${filePath}`).catch(() => null) === null) continue

            if (isPrivate) {
                const encrypted = await encryptBlob(await fsp.readFile(`${DATA_DIR}/files/${filePath}`), secret)
                await fsp.writeFile(
                    `${PUBLIC_DIR}/files/${filePath}`,
                    encrypted,
                )
            } else {
                await fsp.copyFile(
                    join(DATA_DIR, 'files', filePath),
                    join(PUBLIC_DIR, 'files', filePath),
                )
            }
        }
    }

    if (!isPrivate) return note

    // encrypt note
    const encrypted = await encryptBlob(utf8.encoder.encode(JSON.stringify(note)), secret)
    return {
        id: note.id,
        text: '',
        createdAt: note.createdAt,
        files: [],
        visibility: 'followers',
        encrypted: base64.encode(encrypted),
    }
})

await fsp.writeFile(
    new URL('../../data/notes-public.json', import.meta.url),
    JSON.stringify(publicNotes.filter(Boolean)),
)
