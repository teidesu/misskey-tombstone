import type { Note } from '../data.ts'

import { writeFile } from 'node:fs/promises'

import { ffetch } from '@fuman/fetch'
import { parallelMap } from '@fuman/utils'

import 'dotenv/config'

const notes = (await import('../../data/notes-orig.json')).default as any as Note[]

const notesCache = new Map<string, any>()
async function fetchNote(noteId: string) {
    if (notesCache.has(noteId)) return notesCache.get(noteId)
    const res = await ffetch('/api/notes/show', {
        baseUrl: `https://${process.env.HOSTNAME}`,
        json: {
            i: process.env.TOKEN,
            noteId,
        },
    }).json<any>()
    notesCache.set(noteId, res)
    return res
}

const usersCache = new Map<string, any>()
async function fetchUser(userId: string) {
    if (usersCache.has(userId)) return usersCache.get(userId)
    const res = await ffetch('/api/users/show', {
        baseUrl: `https://${process.env.HOSTNAME}`,
        json: {
            i: process.env.TOKEN,
            userId,
        },
    }).json<any>()
    usersCache.set(userId, res)
    return res
}

const newNotes = await parallelMap(notes, async (note) => {
    if (note.visibility === 'specified') return note // these won't be displayed anyway

    const fullNote = await fetchNote(note.id)

    const newNote: any = { ...note }

    if (fullNote.mentions && fullNote.mentions.length > 0) {
        newNote.mentions = await parallelMap(fullNote.mentions, async (user: string) => {
            const userData = await fetchUser(user)
            return {
                username: userData.username,
                host: userData.host,
                uri: userData.uri,
            }
        })
        console.log('fetched mentions for note', note.id)
    }

    if (note.replyId != null) {
        const replyNote = await fetchNote(note.replyId)
        console.log('fetched reply for note', note.id)
        newNote.replyUrl = replyNote.uri ?? `https://${process.env.HOSTNAME}/notes/${replyNote.id}`
    }

    return newNote
}, {
    onError(item, idx, error) {
        console.log(`Error fetching note ${item.id}: ${error}`)
        return 'ignore'
    },
})

await writeFile(
    new URL('../../data/notes-ext.json', import.meta.url),
    JSON.stringify(newNotes),
)
