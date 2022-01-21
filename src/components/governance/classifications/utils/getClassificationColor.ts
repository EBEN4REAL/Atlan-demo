const getClassificationColorHex = (
    color?: 'Green' | 'Red' | 'Yellow' | 'White'
) => {
    if (color === 'Green') return '#00A680'
    if (color === 'Yellow') return '#FFB119'
    if (color === 'Red') return '#CF592E'
    if (color === 'White') return '#FFFFFF'
    return '#00A680'
}

export default getClassificationColorHex
