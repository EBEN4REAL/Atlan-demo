import bodybuilder from 'bodybuilder'
import { computed } from 'vue'
import { Search } from '~/services/meta/search'

function useUserPopover(type: string, item: any) {
    const query = bodybuilder()
        .filter(type === 'group' ? 'terms' : 'term', 'ownerUsers', item)
        .aggregation('terms', '__typeName.keyword', {}, 'group_by_typeName')
        .size(10)
        .build()
    const { data } = Search.IndexSearch({ dsl: query }, {})
    const bussinesCount = computed(() => {
        const terms = [
            'atlasglossary',
            'atlasglossarycategory',
            'atlasglossaryterm',
        ]
        const aggs = data?.value?.aggregations?.group_by_typeName?.buckets || []
        let count = 0
        aggs.forEach((el) => {
            if (terms.includes(el.key.toLowerCase())) {
                count += el.doc_count
            }
        })
        return count
    })
    const assetCount = computed(() => {
        const aggs = data?.value?.aggregations?.group_by_typeName?.buckets || []
        let count = 0
        aggs.forEach((el) => {
            count += el.doc_count
        })
        return count
    })

    const getUserProfiles = (user: any) => {
        const profile = user?.attributes?.profiles
        let profileObj = {}
        if (profile && profile.length) {
            const profileJsonStr = profile[0]
            try {
                profileObj = JSON.parse(profileJsonStr)
            } catch (error) {
                console.error('error parsing user profile json', error)
            }
        }
        return profileObj;
    }

    return {
        data,
        bussinesCount,
        assetCount,
        getUserProfiles
    }
}

export default useUserPopover
