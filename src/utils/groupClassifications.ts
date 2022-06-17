/**
 *
 * @param classificationsList @desc this is the classifications list to be grouped
 * @param isPropagated @desc represents the function to determine if the classification is propagated or not
 * @returns grouped classifications with the same name 
 * @example 164717 -> 2m 44s
 */

 export const groupClassifications = (classificationsList, isPropagated) => {
    const classList = classificationsList.reduce((acc, cur, i: number) => {
        if(!acc.length) {
            acc.push({
                ...cur,
                count: 1,
                propagated: isPropagated(cur),
                entityParents: [cur]
            })
        }else if(acc.length && i > 0) {
            const classIndex = acc.findIndex(cl => cl.displayName === cur?.displayName && (isPropagated(cur) && cl?.propagated))
            if(classIndex > -1) {
                acc[classIndex].count += 1
                acc[classIndex].entityParents.push(cur)
            }else {
                acc.push({
                    ...cur,
                    count: 1,
                    propagated: isPropagated(cur),
                    entityParents: [cur]
                })
            }
        }
        return acc
    }, [])

    return classList
}
