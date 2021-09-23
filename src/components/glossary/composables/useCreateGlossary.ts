import { watch, ref, Ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { generateUUID } from '~/utils/helper/generator'
import { Components } from '~/api/atlas/client'

import { useAPI } from '~/api/useAPI'
import {
    CREATE_GLOSSARY,
    CREATE_GLOSSARY_CATEGORY,
    CREATE_GLOSSARY_TERM,
} from '~/api/keyMaps/glossary'

import useUpdateGtcEntity from './useUpdateGtcEntity'

import whoami from '~/composables/user/whoami'

const useCreateGlossary = () => {
    const error = ref<any>()
    const isLoading = ref<boolean | null>()
    const router = useRouter()

    const { username } = whoami()

    const refetchGlossaryTree = inject<(guid: string | 'root') => void>(
        'refetchGlossaryTree'
    )

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
            name: 'Untitled Glossary',
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
        parentCategoryGuid?: string,
        title?: string,
        description?: string,
        status?: string,
        ownerUsers?: string,
        ownerGroups?: string
    ) => {
        body.value = {
            name: title ?? generateUUID(),
            shortDescription: description ?? '',
            longDescription: '',
            assetStatus: status ?? 'draft',
            ownerUsers: ownerUsers ?? `${username.value}`,
            ownerGroups: ownerGroups ?? ``,
            anchor: {
                glossaryGuid: parentGlossaryGuid,
            },
        }

        message.loading({
            content: 'Creating new category...',
            key: `${title}`,
        })
        if (parentCategoryGuid && parentCategoryGuid !== '') {
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

        watch(data, (newData) => {
            if (newData?.guid) {
                message.success({
                    content: `${title} created!`,
                    key: `${title}`,
                    duration: 2,
                })
                if (refetchGlossaryTree) {
                    refetchGlossaryTree(
                        parentCategoryGuid || parentCategoryGuid !== ''
                            ? parentCategoryGuid
                            : 'root'
                    )
                }
            }
        })

        watch([createError, isValidating], ([newError, newValidating]) => {
            error.value = newError?.value

            const errMsg = createError.value?.response?.data?.errorMessage
            message.error({
                content: `${errMsg.slice(0, 1).toUpperCase()}${errMsg.slice(
                    1
                )}`,
                key: `${title}`,
                duration: 2,
            })

            isLoading.value = newValidating?.value
        })
    }

    const createTerm = (
        parentGlossaryGuid: string,
        parentCategoryGuid?: string,
        title?: string,
        description?: string,
        status?: string,
        ownerUsers?: string,
        ownerGroups?: string
    ) => {
        body.value = {
            name: title ?? generateUUID(),
            shortDescription: description ?? '',
            longDescription: '',
            assetStatus: status ?? 'draft',
            ownerUsers: ownerUsers ?? `${username.value}`,
            ownerGroups: ownerGroups ?? ``,
            anchor: {
                glossaryGuid: parentGlossaryGuid,
            },
        }
        message.loading({ content: 'Creating new term...', key: `${title}` })
        if (parentCategoryGuid && parentCategoryGuid !== '') {
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

        watch(data, (newData) => {
            console.log(data)
            if (newData?.guid) {
                message.success({
                    content: `${title} created!`,
                    key: `${title}`,
                    duration: 2,
                })
                if (refetchGlossaryTree) {
                    refetchGlossaryTree(
                        parentCategoryGuid || parentCategoryGuid !== ''
                            ? parentCategoryGuid
                            : 'root'
                    )
                }
            }
        })
        watch([createError, isValidating], ([newError, newValidating]) => {
            error.value = newError?.value
            const errMsg = createError.value?.response?.data?.errorMessage
            message.error({
                content: `${errMsg.slice(0, 1).toUpperCase()}${errMsg.slice(
                    1
                )}`,
                key: `${title}`,
                duration: 2,
            })

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
