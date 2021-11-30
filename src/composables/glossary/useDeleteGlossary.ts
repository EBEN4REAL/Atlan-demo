import { watch, ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { Glossary } from '~/services/meta/glossary/index'
import { message } from 'ant-design-vue'

const useDeleteGlossary = () => {
    const error = ref<any>()
    const router = useRouter()

    const redirectAfterDelete = (
        type: 'glossary' | 'category' | 'term',
        guid: string
    ) => {
        error.value = null

        if (type === 'glossary') router.push(`/glossary`)
        else router.push(`/glossary/${guid}`)
    }

    const deleteGlossary = (guid: string, redirect?: boolean) => {
        const {
            data,
            error: deleteError,
            isLoading,
        } = Glossary.deleteGlossary(guid)

        if (redirect) redirectAfterDelete('glossary', guid)
        watch(deleteError, (newError) => {
            error.value = newError
        })

        return { data, deleteError, isLoading }
    }

    const deleteCategory = (
        guid: string,
        redirect?: boolean,
        parentGlossaryGuid?: string
    ) => {
        const {
            data,
            error: deleteError,
            isLoading,
        } = Glossary.deleteCategory(guid)
        if (redirect && parentGlossaryGuid) {
            redirectAfterDelete('category', parentGlossaryGuid)
        }
        watch(deleteError, (newError) => {
            error.value = newError
        })

        return { data, deleteError, isLoading }
    }

    const deleteTerm = (
        guid: string,
        redirect?: boolean,
        parentGlossaryGuid?: string
    ) => {
        const {
            data,
            error: deleteError,
            isLoading,
        } = Glossary.deleteTerm(guid)
        if (redirect && parentGlossaryGuid) {
            redirectAfterDelete('term', parentGlossaryGuid)
        }

        watch(deleteError, (newError) => {
            const errMsg =
                newError?.response?.data?.errorMessage ||
                'Something went wrong!'

            message.error({
                content: `${errMsg}`,
                duration: 5,
            })
        })

        return { data, deleteError, isLoading }
    }

    return {
        deleteGlossary,
        deleteCategory,
        deleteTerm,
        error,
    }
}

export default useDeleteGlossary
