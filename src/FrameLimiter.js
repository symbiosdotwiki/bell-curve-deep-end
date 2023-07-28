import { useEffect } from "react"
import { useThree } from '@react-three/fiber'

export default function FrameLimiter(props) {
    const { limit } = props
    const {invalidate, clock, advance} = useThree()
    useEffect(() => {
        let delta = 0
        const interval = 1/limit
        const update = () => {
            requestAnimationFrame(update)
            delta += clock.getDelta()

            if (delta > interval) {
                invalidate()
                delta = delta % interval
            }
        }

        update()
    }, [])

    return null
}