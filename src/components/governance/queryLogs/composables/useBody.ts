import bodybuilder from 'bodybuilder'

interface useBodyProps {
    from: number
    limit: number
    gte: string
    lt: string
}
export default function useBody({ from, limit, gte, lt }: useBodyProps) {
    const base = bodybuilder()

    base.from(from || 0)
    base.size(limit || 0)
    base.sort('@timestamp', 'desc')
    base.query('range', 'time', {
        gte,
        lt,
    })

    return base.build()
}
