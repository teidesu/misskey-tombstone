import type { Note as NoteType } from '../data.ts'
import { base64, utf8 } from '@fuman/utils'
import { createSignal, For, onMount } from 'solid-js'
import { decryptBlob, prepareSecret, readStoredSecret } from '../crypto.ts'
import { getFileExtension } from '../utils.ts'
import { MediumZoom } from './MediumZoom.tsx'
import { Mfm } from './Mfm.tsx'

// todo: support multiple users maybe
const username = import.meta.env.USERNAME
const userAvatar = import.meta.env.AVATAR

let preparedSecret: CryptoKey | undefined

export function Note(props: { note: NoteType }) {
    const [note, setNote] = createSignal<NoteType>(props.note)

    const files = () => note().files.map(file => ({
        ...file,
        url: `/files/${file.id}.${getFileExtension(file.type)}`,
    }))
    const images = () => files().filter(file => file.type.startsWith('image/'))
    const otherFiles = () => files().filter(file => !file.type.startsWith('image/'))

    onMount(async () => {
        if (!note().encrypted) return

        const secret = readStoredSecret()
        if (!secret) return

        if (!preparedSecret) {
            preparedSecret = await prepareSecret(secret)
        }
        const decrypted = await decryptBlob(base64.decode(note().encrypted!), preparedSecret)
        setNote(JSON.parse(utf8.decoder.decode(decrypted)))
    })

    const content = (
        <>
            {note().encrypted && (
                <div class="text-gray-500">
                    (this is a followers-only post, please
                    {' '}
                    <a
                        class="text-blue-500 underline hover:text-blue-800"
                        href="/auth"
                    >
                        log in
                    </a>
                    {' '}
                    to see it)
                </div>
            )}
            <div class="flex-1 overflow-auto">
                {note().text && (
                    <Mfm
                        mentions={note().mentions}
                        text={note().text ?? ''}
                    />
                )}
            </div>
            {otherFiles.length > 0 && (
                <div class="flex flex-col gap-4">
                    <For each={otherFiles()}>
                        {file => (
                            <a class="text-blue-500 underline hover:text-blue-800" href={file.url} rel="nofollow noopener" target="_blank">
                                {file.name}
                            </a>
                        )}
                    </For>
                </div>
            )}
            {images.length > 0 && (
                <div class="flex flex-row flex-wrap justify-center gap-4">
                    <For each={images()}>
                        {image => (
                            <MediumZoom
                                class="max-w-80 rounded-lg object-cover"
                                src={image.url}
                                alt={image.name}
                            />
                        )}
                    </For>
                </div>
            )}
        </>
    )

    return (
        <div class="max-w-full flex flex-col gap-4 overflow-hidden border border-gray-200 rounded-lg p-4">
            <div class="flex flex-row gap-4">
                <img class="h-12 w-12 rounded-full" src={userAvatar} alt={username} />
                <div class="flex flex-col">
                    <div class="font-bold">{username}</div>
                    <a
                        href={`/notes/${note().id}`}
                        class="text-sm text-gray-500"
                    >
                        {new Date(note().createdAt).toLocaleString('ru')}
                        {note().visibility === 'followers' && (
                            <span class="text-sm text-gray-500">
                                {' '}
                                (followers-only)
                            </span>
                        )}
                    </a>
                </div>
            </div>
            {note().replyUrl && (
                <div class="border-l-4 border-blue-500 pl-4 text-sm italic">
                    reply to:
                    {' '}
                    <a
                        class="text-blue-500 underline hover:text-blue-800"
                        href={note().replyUrl!}
                        rel="nofollow noopener"
                        target="_blank"
                    >
                        {note().replyUrl}
                    </a>
                </div>
            )}
            {note().cw != null
                ? (
                        <details class="flex flex-col gap-4">
                            <summary class="cursor-pointer text-blue-500 underline hover:text-blue-800">
                                CW:
                                {' '}
                                {note().cw}
                            </summary>
                            {content}
                        </details>
                    )
                : content}
        </div>

    )
}
