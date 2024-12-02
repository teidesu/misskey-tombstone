import { z } from 'zod'

import notesJson from '../data/notes-public.json' with { type: 'json' }

const notesSchema = z.array(z.object({
    id: z.string(),
    text: z.string().nullable(),
    cw: z.string().nullish(),
    createdAt: z.string(),
    files: z.array(z.object({
        id: z.string(),
        createdAt: z.string(),
        name: z.string(),
        type: z.string(),
        url: z.string(),
        comment: z.string().nullish(),
        md5: z.string(),
    })),
    replyId: z.string().nullish(),
    replyUrl: z.string().nullish(),
    mentions: z.array(z.object({
        username: z.string(),
        host: z.string().nullish(),
        uri: z.string().nullish(),
    })).nullish(),
    visibility: z.enum(['public', 'home', 'followers', 'specified']),
    encrypted: z.string().nullish(),
}))

export const notes = notesSchema.parse(notesJson).reverse()

export type Note = z.infer<typeof notesSchema>[number]
