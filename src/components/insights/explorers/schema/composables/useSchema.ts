import { Ref } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

export function useSchema() {
    const mixClassificationsAndTerms = (
        classifications: any[],
        terms: any[],
        includeClassifications: boolean = true
    ) => {
        const mix = []
        let i = 0,
            clength = classifications.length
        let j = 0,
            tlength = terms.length
        let k = 0
        while (i < clength && j < tlength) {
            if (k % 2 == 0) {
                // classifications does not have displayText property
                includeClassifications &&
                    mix.push({
                        ...classifications[i],
                        type: 'classification',
                        displayText: classifications[i].typeName,
                    })
                i++
            } else {
                // terms already have displayText property
                mix.push({ ...terms[j], type: 'term' })
                j++
            }
            k++
        }
        if (i < clength) {
            for (let m = i; m < clength; m++) {
                mix.push({
                    ...classifications[m],
                    type: 'classification',
                    displayText: classifications[m].typeName,
                })
            }
        }
        if (j < tlength) {
            for (let m = j; m < tlength; m++) {
                mix.push({ ...terms[m], type: 'term' })
            }
        }
        return mix
    }
    const mixOwnersAndGroups = (owners: string[], groups: string[]) => {
        const mix = []
        let i = 0,
            clength = owners.length
        let j = 0,
            tlength = groups.length
        let k = 0
        while (i < clength && j < tlength) {
            if (k % 2 == 0) {
                // owners does not have displayText property
                mix.push({
                    type: 'user',
                    username: owners[i],
                })
                i++
            } else {
                // groups already have username property
                mix.push({
                    type: 'group',
                    username: groups[i],
                })
                j++
            }
            k++
        }
        if (i < clength) {
            for (let m = i; m < clength; m++) {
                mix.push({
                    type: 'user',
                    username: owners[m],
                })
            }
        }
        if (j < tlength) {
            for (let m = j; m < tlength; m++) {
                mix.push({
                    type: 'group',
                    username: groups[m],
                })
            }
        }
        return mix
    }
    const splitArray = (sizeofSplit: number, arr: any[]) => {
        if (sizeofSplit >= arr.length) {
            return {
                a: [...arr],
                b: [],
            }
        }
        const a: any[] = arr.slice(0, sizeofSplit)
        const b: any[] = arr.slice(sizeofSplit, arr.length)
        return {
            a,
            b,
        }
    }
    const isSameNodeOpenedInSidebar = (
        item,
        activeInlineTab: Ref<activeInlineTabInterface>
    ) => {
        return (
            activeInlineTab.value.assetSidebar.isVisible &&
            item.guid === activeInlineTab.value.assetSidebar.assetInfo.guid
        )
    }
    return {
        isSameNodeOpenedInSidebar,
        splitArray,
        mixClassificationsAndTerms,
        mixOwnersAndGroups,
    }
}
