/**
     * 
     * @param {Object | Array} data   data object from where string needs to be extracted     
     * @param {String} path - path of the object, can be simple ".array[0].displayName" || "random {{.results.ID}} xx"
     * @returns required string
     */
// eslint-disable-next-line import/prefer-default-export
export const getStringFromPath = (data: object | Array<any>, path: string) => {
    if (!path || ['', '.'].includes(path)) return data;
    const arrayReg = /\w*\[\d*\]$/g
    const r = /\{\{(\.[\w\W]*?)\}\}/g
    const varArr = path.match(r);
    let label: unknown = '';
    if (varArr?.length) {
        label = path
        varArr.forEach(p => {
            const pathParts = p.split('{{')[1].split('}}')[0].split('.').slice(1)
            let word: unknown = data;
            pathParts.forEach((pp: string) => {
                const isArr = arrayReg.test(pp)
                if (isArr) {
                    const index = parseInt(pp.match(/(?<=\[).+?(?=\])/)[0], 10)
                    word = (word as string)[pp.split('[')[0]][index]
                } else word = (word as string)[pp]
            })
            label = (label as string).replace(p, word as string)
        })
    } else {
        label = data;
        const labelPathParts = path.split('.').slice(1)
        labelPathParts.forEach((p: string) => {
            const isArr = arrayReg.test(p)
            if (isArr) {
                const index = parseInt(p.match(/(?<=\[).+?(?=\])/)[0], 10)
                label = (label as string)[p.split('[')[0]][index]
            } else label = (label as string)[p]
        })
    }
    return label || path;
}

export const genParams = (dO, pO) => {
    const newParamObject = {}
    Object.entries(pO).forEach(([k, p]: string[]) => {
        if (typeof p === 'object')
            newParamObject[k] = p;
        else {
            const val = getStringFromPath(dO, p);
            newParamObject[k] = val;
        }
    })
    return newParamObject;
}

/**
     * 
     * @param v string containing ids in curly braces eg. {{.idName}} xx {{.anotherID}}
     * @returns [idName, anotherID]
     */
export const keyIDs = (v) => {
    const r = /\{\{(\.[\w\W]*?)\}\}/g
    const keys: string[] = []
    if (typeof v === 'string') {
        const varArr = v.match(r);
        if (varArr?.length) {
            // ? checking for single id, {{.id}}
            const dependendID = varArr[0].split('{{')[1].split('}}')[0].split('.').slice(1)[0]
            keys.push(dependendID)
        }
    }
    return keys
}