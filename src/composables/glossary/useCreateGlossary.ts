import { watch, ref, Ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { generateUUID } from '~/utils/helper/generator'
import { Components } from '~/api/atlas/client'

import { useAPI } from '~/api/useAPI'
import {
    CREATE_GLOSSARY,
    CREATE_GLOSSARY_CATEGORY,
    CREATE_GLOSSARY_TERM,
} from '~/api/keyMaps/glossary'

import useUpdateGtcEntity from './useUpdateGtcEntity'

const useCreateGlossary = () => {
    const error = ref<any>()
    const isLoading = ref<boolean | null>()
    const router = useRouter()

    const refetchGlossaryTree = inject<(guid: string | 'root') => void>('refetchGlossaryTree')

    const redirectToProfile = (
        type: 'glossary' | 'category' | 'term',
        guid: string
    ) => {
        error.value = null
        isLoading.value = null

        if (type === 'glossary') router.push(`/glossary/${guid}`)
        else router.push(`/glossary/${type}/${guid}`)
    }

    const body: Ref<Record<string, any>> = ref({
        longDescription: '',
        qualifiedName: '',
        shortDescription: '',
        name: '',
    })

    const createGlossary = () => {
        body.value = {
            qualifiedName: generateUUID(),
            name: 'New Glossary',
            shortDescription: '',
            longDescription: '',
            assetStatus: 'draft',
        }

        const {
            data,
            error: createError,
            isValidating,
        } = useAPI<Components.Schemas.AtlasGlossary>(CREATE_GLOSSARY, 'POST', {
            cache: false,
            body: body.value,
        })

        watch(data, (newData) => {
            if (newData?.guid) {
                redirectToProfile('glossary', newData.guid)
            }
        })
        watch([createError, isValidating], ([newError, newValidating]) => {
            error.value = newError?.value
            isLoading.value = newValidating?.value
        })
    }

    const createCategory = (
        parentGlossaryGuid: string,
        parentCategoryGuid?: string
    ) => {
        body.value = {
            name: generateUUID(),
            displayText: 'New Category',
            shortDescription: '',
            longDescription: '',
            assetStatus: 'draft',
            anchor: {
                glossaryGuid: parentGlossaryGuid,
            },
        }
        if (parentCategoryGuid) {
            body.value.parentCategory = {
                categoryGuid: parentCategoryGuid,
            }
        }

        const {
            data,
            error: createError,
            isValidating,
        } = useAPI<Components.Schemas.AtlasGlossaryCategory>(
            CREATE_GLOSSARY_CATEGORY,
            'POST',
            {
                cache: false,
                body: body.value,
            }
        )
        const { data: updateData, updateEntity } = useUpdateGtcEntity()

        watch(data, (newData) => {
            if (newData?.guid) {
                updateEntity('category', newData.guid, {
                    guid: newData.guid,
                    anchor: newData.anchor,
                    name: 'New Category',
                })
            }
        })
        watch(updateData, (newData) => {
            if (newData?.guid) {
                if (refetchGlossaryTree) {
                    refetchGlossaryTree(parentCategoryGuid ?? 'root')
                }
                redirectToProfile('category', newData.guid)
            }
        })
        watch([createError, isValidating], ([newError, newValidating]) => {
            error.value = newError?.value
            isLoading.value = newValidating?.value
        })
    }

    const createTerm = (
        parentGlossaryGuid: string,
        parentCategoryGuid?: string
    ) => {
        body.value = {
            name: generateUUID(),
            displayText: 'New Term',
            shortDescription: '',
            longDescription: '',
            assetStatus: 'draft',
            anchor: {
                glossaryGuid: parentGlossaryGuid,
            },
        }
        if (parentCategoryGuid) {
            body.value.categories = [
                {
                    categoryGuid: parentCategoryGuid,
                },
            ]
        }

        const {
            data,
            error: createError,
            isValidating,
        } = useAPI<Components.Schemas.AtlasGlossaryTerm>(
            CREATE_GLOSSARY_TERM,
            'POST',
            {
                cache: false,
                body: body.value,
            }
        )
        const { data: updateData, updateEntity } = useUpdateGtcEntity()

        watch(data, (newData) => {
            if (newData?.guid) {
                updateEntity('term', newData.guid, {
                    ...newData,
                    name: 'New Term',
                })
            }
        })
        watch(updateData, (newData) => {
            if (newData?.guid) {
                if (refetchGlossaryTree) {
                    refetchGlossaryTree(parentCategoryGuid ?? 'root')
                }
                redirectToProfile('term', newData.guid)
            }
        })
        watch([createError, isValidating], ([newError, newValidating]) => {
            error.value = newError?.value
            isLoading.value = newValidating?.value
        })
    }

    return {
        createGlossary,
        createCategory,
        createTerm,
        error,
        isLoading,
    }
}

export default useCreateGlossary
