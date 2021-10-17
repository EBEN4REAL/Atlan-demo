import { watch, ref, inject } from 'vue';
import { useRouter } from 'vue-router'

import { useAPI } from "~/services/api/useAPI"
import { DELETE_GLOSSARY, DELETE_GLOSSARY_CATEGORY, DELETE_GLOSSARY_TERM } from "~/api/keyMaps/glossary"

const useDeleteGlossary = () => {
    const error = ref<any>();
    const isLoading = ref<boolean | null>();
    const router = useRouter()
    
    const refetchGlossaryTree = inject<(guid: string | 'root', refetchEntityType?: 'term' | 'category') => void>('refetchGlossaryTree')

    const redirectAfterDelete = (type: 'glossary' | 'category' | 'term', guid: string) => {
        error.value = null;
        isLoading.value = null;

        if (type === 'glossary') router.push(`/glossary`)
        else router.push(`/glossary/${guid}`)
    }
    

    const deleteGlossary = (guid: string, redirect?: boolean) => {
        const { data, error: deleteError, isLoading:loading } = useAPI(DELETE_GLOSSARY, 'DELETE', {
            cache: false,
            pathVariables: {
                guid
            }
        });

        // watch(data, (newData) => {
        //     if(newData?.guid){
        //         redirectAfterDelete('glossary', newData.guid)
        //     }
        // });
        if(redirect) redirectAfterDelete('glossary', guid)
        watch([deleteError, loading], ([newError, newLoading]) => {
            error.value = newError;
            isLoading.value = newLoading;
        });

        return { data, deleteError }
    };


    const deleteCategory = (guid: string, redirect?: boolean, parentGlossaryGuid?: string,) => {
        const { data, error:deleteError, isLoading:loading } = useAPI(DELETE_GLOSSARY_CATEGORY, 'DELETE', {
            cache: false,
            pathVariables: {
                guid
            }
        });

        if(redirect && parentGlossaryGuid) { 
            redirectAfterDelete('category', parentGlossaryGuid)
        }
        watch([deleteError, loading], ([newError, newLoading]) => {
            error.value = newError;
            isLoading.value = newLoading
        });

        return { data, deleteError }
    };


    const deleteTerm = (guid: string, redirect?: boolean, parentGlossaryGuid?: string) => {

        const { data, error: deleteError, isLoading:loading } = useAPI(DELETE_GLOSSARY_TERM, 'DELETE', {
            cache: false,
            pathVariables: {
                guid
            }
        });

        if(redirect && parentGlossaryGuid) {
            redirectAfterDelete('term', parentGlossaryGuid)
        }

        watch([deleteError, loading], ([newError, newLoading]) => {
            error.value = newError;
            isLoading.value = newLoading;
        });

        return { data, deleteError }
    };

    return {
        deleteGlossary,
        deleteCategory,
        deleteTerm,
        error,
        isLoading
    }
}

export default useDeleteGlossary;
