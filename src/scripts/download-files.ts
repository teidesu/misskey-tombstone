import type { Note } from '../data.ts'
import { createWriteStream } from 'node:fs'
import * as fsp from 'node:fs/promises'
import { join } from 'node:path'

import { fileURLToPath } from 'node:url'
import { ffetch } from '@fuman/fetch'
import { webReadableToFuman, write } from '@fuman/io'
import { nodeWritableToFuman } from '@fuman/node'

import { asyncPool } from '@fuman/utils'
import { getFileExtension } from '../utils.ts'

const notes = (await import('../../data/notes-orig.json')).default as any as Note[]

const allFiles = notes.flatMap(note => note.files)

const DL_DIR = fileURLToPath(new URL('../../public/files', import.meta.url))
await fsp.mkdir(DL_DIR, { recursive: true })

await asyncPool(allFiles, async (file) => {
    const dlPath = join(DL_DIR, `${file.id}.${getFileExtension(file.type)}`)

    const dl = webReadableToFuman(await ffetch(file.url).stream())
    const stream = nodeWritableToFuman(createWriteStream(dlPath))

    await write.pipe(stream, dl)

    stream.close()
    console.log(`Downloaded ${file.id} to ${dlPath}`)
}, {
    onError(item, idx, error) {
        console.log(`Error downloading ${item.id}: ${error}`)
        return 'ignore'
    },
})
