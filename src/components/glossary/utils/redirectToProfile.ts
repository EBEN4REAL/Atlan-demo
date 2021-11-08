import { Router, useRouter } from 'vue-router'

export default (router: Router) => (
    typeName: 'AtlasGlossary' | 'AtlasGlossaryCategory' | 'AtlasGlossaryTerm',
    guid: String,
    queryParams?: {
        tab: 'overview' | 'terms'
        cta: 'glossaryContext' | 'addTerm'
    }
): void  => {
    let query = {}
    if(queryParams?.tab) {
        query['tab'] = queryParams.tab
    }
    if(queryParams?.cta) {
        query['cta'] = queryParams.cta
    }
    if(guid !== '-1' && guid) {
        // Add Popup to tell user they dont have access to entity

        if (typeName === 'AtlasGlossary')
            router.push({
                path: `/glossary/${guid}`,
                query
            })
        else if (typeName === 'AtlasGlossaryCategory')
            router.push({
                path: `/glossary/category/${guid}`
            })
        else if (typeName === 'AtlasGlossaryTerm')
            router.push({
                path: `/glossary/term/${guid}`
            })
    }
}
