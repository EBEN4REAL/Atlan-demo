const getClassificationColorHex = (
    color?: 'green' | 'red' | 'yellow' | 'white'
) => {
    if (color === 'green') return '#00A680'
    if (color === 'yellow') return '#FFB119'
    if (color === 'red') return '#CF592E'
    if (color === 'white') return '#FFFFFF'
    return '#00A680'
}

export default getClassificationColorHex
