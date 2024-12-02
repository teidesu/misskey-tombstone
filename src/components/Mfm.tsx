// based on https://github.com/misskey-dev/misskey/blob/develop/packages/frontend/src/components/global/MkMfm.ts
import type { JSX } from 'astro/jsx-runtime'
import type { Note } from '../data.ts'
import * as mfm from 'mfm-js'

import { createMemo, createSignal, For, onMount } from 'solid-js'
import './mfm.css'

function safeParseFloat(str: unknown): number | null {
    if (typeof str !== 'string' || str === '') return null
    const num = Number.parseFloat(str)
    if (Number.isNaN(num)) return null
    return num
}

interface MfmProps {
    text: string
    plain?: boolean
    nowrap?: boolean
    isNote?: boolean
    emojiUrls?: Record<string, string>
    rootScale?: number
    enableEmojiMenu?: boolean
    enableEmojiMenuReaction?: boolean
    mentions?: Note['mentions']
}

function validTime(t: string | boolean | null | undefined) {
    if (t == null) return null
    if (typeof t === 'boolean') return null
    return t.match(/^-?[0-9.]+s$/) ? t : null
}

function validColor(c: unknown): string | null {
    if (typeof c !== 'string') return null
    return c.match(/^[0-9a-f]{3,6}$/i) ? c : null
}

export function Mfm(props: MfmProps) {
    // こうしたいところだけど functional component 内では provide は使えない
    // provide('linkNavigationBehavior', props.linkNavigationBehavior);

    const host = import.meta.env.HOSTNAME
    const rootAst = createMemo(() => mfm.parse(props.text))

    const genEl = (ast: mfm.MfmNode[], scale: number) => ast.map((token): JSX.Element => {
        switch (token.type) {
            case 'text': {
                const text = token.props.text.replace(/(\r\n|\n|\r)/g, '\n')

                const res: JSX.Element[] = []
                for (const t of text.split('\n')) {
                    res.push(<br />)
                    res.push(t)
                }
                res.shift()
                return res
            }

            case 'bold': {
                return <b>{genEl(token.children, scale)}</b>
            }

            case 'strike': {
                return <del>{genEl(token.children, scale)}</del>
            }

            case 'italic': {
                return <i>{genEl(token.children, scale)}</i>
            }

            case 'fn': {
                let style: string | undefined
                switch (token.props.name) {
                    case 'tada': {
                        const speed = validTime(token.props.args.speed) ?? '1s'
                        const delay = validTime(token.props.args.delay) ?? '0s'
                        style = `font-size: 150%;animation: global-tada ${speed} linear infinite both; animation-delay: ${delay};`
                        break
                    }
                    case 'jelly': {
                        const speed = validTime(token.props.args.speed) ?? '1s'
                        const delay = validTime(token.props.args.delay) ?? '0s'
                        style = `animation: mfm-rubberBand ${speed} linear infinite both; animation-delay: ${delay};`
                        break
                    }
                    case 'twitch': {
                        const speed = validTime(token.props.args.speed) ?? '0.5s'
                        const delay = validTime(token.props.args.delay) ?? '0s'
                        style = `animation: mfm-twitch ${speed} ease infinite; animation-delay: ${delay};`
                        break
                    }
                    case 'shake': {
                        const speed = validTime(token.props.args.speed) ?? '0.5s'
                        const delay = validTime(token.props.args.delay) ?? '0s'
                        style = `animation: mfm-shake ${speed} ease infinite; animation-delay: ${delay};`
                        break
                    }
                    case 'spin': {
                        const direction
                            = token.props.args.left
                                ? 'reverse'
                                : token.props.args.alternate
                                    ? 'alternate'
                                    : 'normal'
                        const anime
                            = token.props.args.x
                                ? 'mfm-spinX'
                                : token.props.args.y
                                    ? 'mfm-spinY'
                                    : 'mfm-spin'
                        const speed = validTime(token.props.args.speed) ?? '1.5s'
                        const delay = validTime(token.props.args.delay) ?? '0s'
                        style = `animation: ${anime} ${speed} linear infinite; animation-direction: ${direction}; animation-delay: ${delay};`
                        break
                    }
                    case 'jump': {
                        const speed = validTime(token.props.args.speed) ?? '0.75s'
                        const delay = validTime(token.props.args.delay) ?? '0s'
                        style = `animation: mfm-jump ${speed} linear infinite; animation-delay: ${delay};`
                        break
                    }
                    case 'bounce': {
                        const speed = validTime(token.props.args.speed) ?? '0.75s'
                        const delay = validTime(token.props.args.delay) ?? '0s'
                        style = `animation: mfm-bounce ${speed} linear infinite; transform-origin: center bottom; animation-delay: ${delay};`
                        break
                    }
                    case 'flip': {
                        const transform
                            = (token.props.args.h && token.props.args.v)
                                ? 'scale(-1, -1)'
                                : token.props.args.v
                                    ? 'scaleY(-1)'
                                    : 'scaleX(-1)'
                        style = `transform: ${transform};`
                        break
                    }
                    case 'x2': {
                        return <span class="mfm-x2">{genEl(token.children, scale * 2)}</span>
                    }
                    case 'x3': {
                        return <span class="mfm-x3">{genEl(token.children, scale * 3)}</span>
                    }
                    case 'x4': {
                        return <span class="mfm-x4">{genEl(token.children, scale * 4)}</span>
                    }
                    case 'font': {
                        const family
                            = token.props.args.serif
                                ? 'serif'
                                : token.props.args.monospace
                                    ? 'monospace'
                                    : token.props.args.cursive
                                        ? 'cursive'
                                        : token.props.args.fantasy
                                            ? 'fantasy'
                                            : token.props.args.emoji
                                                ? 'emoji'
                                                : token.props.args.math
                                                    ? 'math'
                                                    : null
                        if (family) style = `font-family: ${family};`
                        break
                    }
                    case 'blur': {
                        // return h('span', {
                        //     class: '_mfm_blur_',
                        // }, genEl(token.children, scale))
                        return <span class="_mfm_blur_">{genEl(token.children, scale)}</span>
                    }
                    case 'rainbow': {
                        const speed = validTime(token.props.args.speed) ?? '1s'
                        const delay = validTime(token.props.args.delay) ?? '0s'
                        style = `animation: mfm-rainbow ${speed} linear infinite; animation-delay: ${delay};`
                        break
                    }
                    case 'sparkle': {
                        // todo
                        return genEl(token.children, scale)
                    }
                    case 'rotate': {
                        const degrees = safeParseFloat(token.props.args.deg) ?? 90
                        style = `transform: rotate(${degrees}deg); transform-origin: center center;`
                        break
                    }
                    case 'position': {
                        const x = safeParseFloat(token.props.args.x) ?? 0
                        const y = safeParseFloat(token.props.args.y) ?? 0
                        style = `transform: translateX(${x}em) translateY(${y}em);`
                        break
                    }
                    case 'scale': {
                        const x = Math.min(safeParseFloat(token.props.args.x) ?? 1, 5)
                        const y = Math.min(safeParseFloat(token.props.args.y) ?? 1, 5)
                        style = `transform: scale(${x}, ${y});`
                        scale = scale * Math.max(x, y)
                        break
                    }
                    case 'fg': {
                        let color = validColor(token.props.args.color)
                        color = color ?? 'f00'
                        style = `color: #${color}; overflow-wrap: anywhere;`
                        break
                    }
                    case 'bg': {
                        let color = validColor(token.props.args.color)
                        color = color ?? 'f00'
                        style = `background-color: #${color}; overflow-wrap: anywhere;`
                        break
                    }
                    case 'border': {
                        let color = validColor(token.props.args.color)
                        color = color ? `#${color}` : 'var(--MI_THEME-accent)'
                        let b_style = token.props.args.style
                        if (
                            typeof b_style !== 'string'
                            || !['hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset']
                                .includes(b_style)
                        ) {
                            b_style = 'solid'
                        }
                        const width = safeParseFloat(token.props.args.width) ?? 1
                        const radius = safeParseFloat(token.props.args.radius) ?? 0
                        style = `border: ${width}px ${b_style} ${color}; border-radius: ${radius}px;${token.props.args.noclip ? '' : ' overflow: clip;'}`
                        break
                    }
                    case 'ruby': {
                        if (token.children.length === 1) {
                            const child = token.children[0]
                            const text = child.type === 'text' ? child.props.text : ''
                            return <ruby>{[text.split(' ')[0], <rt>{text.split(' ')[1]}</rt>]}</ruby>
                        } else {
                            const rt = token.children.at(-1)!
                            const text = rt.type === 'text' ? rt.props.text : ''
                            return (
                                <ruby>
                                    <For each={genEl(token.children.slice(0, token.children.length - 1), scale)}>
                                        {el => el.type === 'rt' ? text.trim() : el}
                                    </For>
                                </ruby>
                            )
                        }
                    }
                    case 'unixtime': {
                        const child = token.children[0]
                        const unixtime = Number.parseInt(child.type === 'text' ? child.props.text : '')
                        return (
                            <span style={{ 'display': 'inline-block', 'font-size': '90%', 'border': 'solid 1px var(--MI_THEME-divider)', 'border-radius': '999px', 'padding': '4px 10px 4px 6px' }}>
                                <i class="ti ti-clock" style={{ 'margin-right': '0.25em' }} />
                                <span>{new Date(unixtime * 1000).toLocaleString('ru')}</span>
                            </span>
                        )
                    }
                    case 'clickable': {
                        return genEl(token.children, scale)
                    }
                }
                if (style === undefined) {
                    return (
                        <span>
                            [$
                            {token.props.name}
                            {' '}
                            $
                            {...genEl(token.children, scale)}
                            ]
                        </span>
                    )
                } else {
                    // return h('span', {
                    //     style: `display: inline-block; ${style}`,
                    // }, genEl(token.children, scale))
                    return (
                        // eslint-disable-next-line solid/style-prop
                        <span style={`display: inline-block; ${style}`}>
                            {genEl(token.children, scale)}
                        </span>
                    )
                }
            }

            case 'small': {
                return <small style={{ opacity: '0.7' }}>{genEl(token.children, scale)}</small>
            }

            case 'center': {
                return <div style={{ 'text-align': 'center' }}>{genEl(token.children, scale)}</div>
            }

            case 'url': {
                return (
                    <a class="text-blue-500 underline hover:text-blue-800" href={token.props.url} rel="nofollow noopener" target="_blank">
                        {token.props.url}
                    </a>
                )
            }

            case 'link': {
                return (
                    <a class="text-blue-500 underline hover:text-blue-800" href={token.props.url} rel="nofollow noopener" target="_blank">
                        {genEl(token.children, scale)}
                    </a>
                )
            }

            case 'mention': {
                const url
                    = props.mentions?.find(mention => mention.host === token.props.host && mention.username === token.props.username)?.uri
                    ?? `https://${token.props.host ?? host}/@${token.props.username}`
                return (
                    <a class="text-blue-500 underline hover:text-blue-800" href={url} rel="nofollow noopener" target="_blank">
                        {token.props.acct}
                    </a>
                )
            }

            case 'hashtag': {
                return `#${token.props.hashtag}`
            }

            case 'blockCode': {
                return (
                    <pre class="my-2 max-w-full overflow-auto rounded-lg bg-gray-100 p-4">
                        <code>
                            {token.props.code}
                        </code>
                    </pre>
                )
            }

            case 'inlineCode': {
                return <code>{token.props.code}</code>
            }

            case 'quote': {
                const quoteClass = 'border-l-4 border-blue-700 pl-4 text-blue-900 text-opacity-80 my-2'
                if (!props.nowrap) {
                    return (
                        <div class={quoteClass}>
                            {genEl(token.children, scale)}
                        </div>
                    )
                } else {
                    return (
                        <span class={quoteClass}>
                            {genEl(token.children, scale)}
                        </span>
                    )
                }
            }

            case 'emojiCode': {
                // todo
                return `:${token.props.name}:`
            }

            case 'unicodeEmoji': {
                return token.props.emoji
            }

            case 'mathInline':
            case 'mathBlock':
                return token.props.formula

            case 'search': {
                return token.props.query
            }

            case 'plain': {
                return <span>{genEl(token.children, scale)}</span>
            }

            default: {
                // @ts-expect-error 存在しないASTタイプ
                console.error('unrecognized ast type:', token.type)

                return []
            }
        }
    }).flat(Infinity) as JSX.Element[]

    // mfm renderer doesn't correctly work with ssr for some reason
    // im too lazy to debug so just force it on the client
    const [content, setContent] = createSignal<JSX.Element[]>([props.text])
    onMount(() => setContent(genEl(rootAst(), props.rootScale ?? 1)))

    return (
        <div class="whitespace-pre-wrap">
            {content()}
        </div>
    )
}
