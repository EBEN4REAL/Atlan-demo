import { watch, ref, Ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { generateUUID } from '~/utils/helper/generator'
import { Components } from '~/types/atlas/client'


// import useAddEvent from '~/composables/eventTracking/useAddEvent'
import { Glossary } from '~/services/meta/glossary/index';

import whoami from '~/composables/user/whoami'

interface createGlossaryParams {
    title?: string,
    description?: string,
    status?: string,
    ownerUsers?: string[],
    ownerGroups?: string[]
}
interface createCategoryParams {
    parentGlossaryGuid: string,
    parentCategoryGuid?: string,
    parentCategoryQf?: string,
    title?: string,
    description?: string,
    status?: string,
    ownerUsers?: string[],
    ownerGroups?: string[]
};
interface createTermParams {
    parentGlossaryGuid: string,
    parentCategoryGuid?: string,
    parentCategoryQf?: string,
    title?: string,
    description?: string,
    status?: string,
    ownerUsers?: string[],
    ownerGroups?: string[],
    categories?: { categoryGuid: string }[]
}
const useCreateGlossary = () => {
    const error = ref<any>()
    const isLoading = ref<boolean | null>()
    const router = useRouter()

    const { username } = whoami()

    // const refetchGlossaryTree = inject<
    //     (guid: string | 'root', categoryQualifiedName?: string, refetchEntityType?: 'category' | 'term') => void
    // >('refetchGlossaryTree')

    const body: Ref<Record<string, any>> = ref({
        longDescription: '',
        qualifiedName: '',
        shortDescription: '',
        name: '',
    })

    const createGlossary = ({
        title,
        description,
        status,
        ownerUsers,
        ownerGroups,
    }: createGlossaryParams) => {
        body.value = {
            qualifiedName: generateUUID(),
            name: title ?? 'Untitled Glossary',
            shortDescription: description ?? '',
            // longDescription: '',
            certificateStatus: status ?? 'DRAFT',
            ownerUsers: ownerUsers ?? [username.value],
            ownerGroups: ownerGroups ?? [],
        }
        message.loading({
            content: 'Creating new glossary...',
            type: 'loading',
            key: title ?? '',
        })

        const {
            data,
            error: createError,
            isValidating,
        } = Glossary.CreateGlossary(body.value)

        watch(data, (newData) => {
            if (newData?.guid) {
                // useAddEvent('gtc', 'glossary', 'created', undefined)

                message.success({
                    content: `${title} created!`,
                    key: `${title}`,
                    duration: 2,
                })
                setTimeout(() => {
                    // redirectToProfile('glossary', newData.guid)
                }, 500)
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
                duration: 5,
            })

            isLoading.value = newValidating?.value
        })
        return { data }
    }

    const createCategory = ({
        parentGlossaryGuid,
        parentCategoryGuid,
        parentCategoryQf,
        title,
        description,
        status,
        ownerUsers,
        ownerGroups,
    }: createCategoryParams) => {
        body.value = {
            name: title ?? 'Untitled Category',
            shortDescription: description ?? '',
            // longDescription: '',
            certificateStatus: status ?? 'DRAFT',
            ownerUsers: ownerUsers ?? [username.value],
            ownerGroups: ownerGroups ?? [],
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
        } = Glossary.CreateCategory(body.value)

        watch(data, (newData) => {
            if (newData?.guid) {
                // useAddEvent('gtc', 'category', 'created', undefined)
                message.success({
                    content: `${title} created!`,
                    key: `${title}`,
                    duration: 2,
                })
                // if (refetchGlossaryTree) {
                //     setTimeout(() => {
                //         refetchGlossaryTree(
                //             parentCategoryGuid || parentCategoryGuid !== ''
                //                 ? parentCategoryGuid
                //                 : 'root',
                //             parentCategoryQf,
                //             'category'
                //         )
                //     }, 500)
                // }
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
                duration: 5,
            })

            isLoading.value = newValidating?.value
        })
    }

    const createTerm = ({
        parentGlossaryGuid,
        parentCategoryGuid,
        parentCategoryQf,
        title,
        description,
        status,
        ownerUsers,
        ownerGroups,
        categories,
    }: createTermParams) => {
        body.value = {
            name: title ?? 'Untitled Term',
            shortDescription: description ?? '',
            longDescription: '',
            certificateStatus: status ?? 'DRAFT',
            ownerUsers: ownerUsers ?? [username.value],
            ownerGroups: ownerGroups ?? [],
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
        if (categories && categories.length) {
            body.value.categories = categories
        }

        const {
            data,
            error: createError,
            isValidating,
        } = Glossary.CreateTerm(body.value)

        watch(data, (newData) => {
            if (newData?.guid) {
                // useAddEvent('gtc', 'term', 'created', undefined)
                message.success({
                    content: `${title} created!`,
                    key: `${title}`,
                    duration: 2,
                })
                // if (refetchGlossaryTree) {
                //     setTimeout(() => {
                //         refetchGlossaryTree(
                //             parentCategoryGuid || parentCategoryGuid !== ''
                //                 ? parentCategoryGuid
                //                 : 'root',
                //                 parentCategoryQf,
                //             'term'
                //         )
                //     }, 500)
                // }
            }
        })
        watch([createError, isValidating], ([newError, newValidating]) => {
            error.value = newError?.value
            const errMsg = createError.value?.response?.data?.errorMessage
            message.error({
                content: `${errMsg?.slice(0, 1)?.toUpperCase()}${errMsg?.slice(
                    1
                )}`,
                key: `${title}`,
                duration: 5,
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
