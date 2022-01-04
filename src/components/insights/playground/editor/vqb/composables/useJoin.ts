export function useJoin() {
    let list = [
        {
            type: 'inner_join',
            name: 'Inner Join',
        },
        {
            type: 'outer_join',
            name: 'Outer Join',
        },
        {
            type: 'left_join',
            name: 'Left Join',
        },
        {
            type: 'right_join',
            name: 'Right Join',
        },
    ]

    return { list }
}
