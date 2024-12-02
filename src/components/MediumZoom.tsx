import mediumZoom from 'medium-zoom'
import { onMount } from 'solid-js'

export interface MediumZoomProps {
    src: string
    alt: string
    class?: string
}

export function MediumZoom(props: MediumZoomProps) {
    let ref!: HTMLImageElement

    onMount(() => {
        const zoom = mediumZoom(ref, {
            margin: 24,
            background: '#00000060',
        })
        zoom.on('open', (event) => {
            ;(event.target as HTMLImageElement).style.objectFit = 'contain'
        })
        zoom.on('opened', (event) => {
            ;(event.target as HTMLImageElement).style.objectFit = ''
        })
    })

    return (
        <img
            class={props.class}
            ref={ref}
            src={props.src}
            alt={props.alt}
        />
    )
}
