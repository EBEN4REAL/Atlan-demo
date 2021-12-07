import { watch, ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { Glossary } from '~/services/meta/glossary/index'
import { message } from 'ant-design-vue'
import useGlossaryStore from '~/store/glossary'

const useDeleteGlossary = () => {
    const error = ref<any>()
    const router = useRouter()
    const glossaryStore = useGlossaryStore()

    const redirectAfterDelete = () => {
        error.value = null
        router.push(`/glossary`)
    }

    const deleteGTC = (guid: string, redirect?: boolean) => {
        const { data, error: deleteError, isLoading } = Glossary.deleteGTC(guid)
        if (redirect) redirectAfterDelete()
        watch(deleteError, (newError) => {
            error.value = newError
        })
        const newList = glossaryStore.list?.filter((el) => el.guid !== guid)
        console.log(newList)
        console.log(glossaryStore.list)
        glossaryStore.setList(newList || [])
        console.log(glossaryStore.list)
        return { data, deleteError, isLoading }
    }
    return {
        deleteGTC,
        error,
    }
}

export default useDeleteGlossary
