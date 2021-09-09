import { useRouter } from 'vue-router'

export default function redirectToProfile(
    entityType: String,
    guid: String
): void {
    console.log(useRouter())
    const router = useRouter()
    console.log(router)
    if (entityType === 'AtlasGlossaryCategory')
        router.push(`/glossary/category/${guid}`)
    else if (entityType === 'AtlasGlossaryTerm')
        router.push(`/glossary/term/${guid}`)
}
