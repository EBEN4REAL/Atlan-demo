import { Router, useRouter } from 'vue-router'

export default (router: Router) => (
    typeName: String,
    guid: String
): void  => {
    // if(guid !== '-1') {
    // }
    if (typeName === 'AtlasGlossary')
        router.push(`/glossary/${guid}`)
    else if (typeName === 'AtlasGlossaryCategory')
        router.push(`/glossary/category/${guid}`)
    else if (typeName === 'AtlasGlossaryTerm')
        router.push(`/glossary/term/${guid}`)
}
