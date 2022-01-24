const getClassificationColorHex = (
    color?: 'green' | 'red' | 'yellow' | 'white' | 'blue'
) => {
    if (color === 'green') return '#00A680'
    if (color === 'yellow') return '#FFB119'
    if (color === 'red') return '#CF592E'
    if (color === 'white') return '#FFFFFF'
    if (color === 'blue') return '#2251CC'
    return '#00A680'
}

export default getClassificationColorHex
