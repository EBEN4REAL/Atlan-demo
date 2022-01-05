export function useJoin() {
    let list = [
        {
            type: 'inner_join',
            name: 'Inner Join',
        },
        {
            type: 'left_join',
            name: 'Left Join',
        },
        {
            type: 'right_join',
            name: 'Right Join',
        },
        {
            type: 'outer_join',
            name: 'Outer Join',
        },
    ]

    return { list }
}
