const getClassificationColorHex = (
    color?: 'Blue' | 'Green' | 'Red' | 'Yellow' | 'White'
) => {
    if (color === 'Blue') return '#2563eb'
    else if (color === 'Green') return '#00A680'
    else if (color === 'Yellow') return '#FFB119'
    else if (color === 'Red') return '#CF592E'
    else if (color === 'White') return '#FFFFFF'
    else return '#2563eb'
}

export default getClassificationColorHex
