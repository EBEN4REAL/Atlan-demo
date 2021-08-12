import { nextTick } from 'vue'

export const centerNode = (
    guid,
    layoutColumns,
    panZoomInstance,
    showDetailsView = false
) => {
    let _lcIndex
    let _lciIndex
    let lciLongestLength = 0

    nextTick(() => {
        layoutColumns.value.forEach((lc, lcIndex) => {
            lc.forEach((lci, lciIndex, arr) => {
                if (arr.length > lciLongestLength) lciLongestLength = arr.length
                lci.fields.forEach((f) => {
                    if (f.guid === guid) {
                        _lcIndex = lcIndex
                        _lciIndex = lciIndex + 1
                    }
                })
            })
        })

        const NUM = showDetailsView ? 400 : 600
        const x = NUM - _lcIndex * 200

        let y
        const lciMidIndex = Math.round(lciLongestLength / 2)
        const diff = lciMidIndex - _lciIndex

        if (_lciIndex === lciMidIndex) y = 200
        else if (_lciIndex < lciMidIndex) y = 200 - diff * 100
        else if (_lciIndex > lciMidIndex) y = 200 + diff * 100

        panZoomInstance.value.moveTo(x, y)
    })
}
