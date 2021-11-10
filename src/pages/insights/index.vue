<template>
    <InsightsComponent />
    <div></div>
</template>

<script lang="ts">
    import {
        defineComponent,
        provide,
        ref,
        toRef,
        computed,
        Ref,
        watch,
        onMounted,
    } from 'vue'
    import { useHead } from '@vueuse/head'
    import InsightsComponent from '~/components/insights/index.vue'
    // import AssetDiscovery from '@/assets/index.vue'
    import { useRoute } from 'vue-router'
    import { Insights as InsightsAPI } from '~/services/meta/insights'
    import { message } from 'ant-design-vue'
    import { SavedQuery } from '~/types/insights/savedQuery.interface'
    import useQueryFolderNamespace from '~/components/insights/explorers/queries/composables/useQueryFolderNamespace'
    // import { QueryFolderNamespace as QueryFolderNamespaceInterface } from '~/types/insights/savedQuery.interface'
    export default defineComponent({
        name: 'Insights Page',
        components: { InsightsComponent },
        props: {},
        setup(props) {
            useHead({
                title: 'Insights',
            })
            const route = useRoute()
            const { getQueryFolderNamespace } = useQueryFolderNamespace()
            const savedQueryGuidFromURL = ref(route.query?.id)
            const isSavedQueryInfoLoaded = ref(true)
            const queryFolderNamespace: Ref<any> = ref()
            const savedQueryInfo = ref(undefined) as unknown as Ref<
                SavedQuery | undefined
            >
            const permissions = computed(() => ({
                private: {
                    readQueries: 'READ_PRIVATE_QUERIES',
                    readFolders: 'READ_PRIVATE_FOLDERS',
                    createQuery: 'CREATE_PRIVATE_QUERIES',
                    createFolder: 'CREATE_PRIVATE_FOLDERS',
                    deleteQuery: 'DELETE_PRIVATE_QUERIES',
                    deleteFolder: 'DELETE_PRIVATE_FOLDERS',
                    updateQuery: 'UPDATE_PRIVATE_QUERIES',
                    updateFolder: 'UPDATE_PRIVATE_FOLDERS',
                    privateToPublicQuery: 'PRIVATE_QUERY_TO_PUBLIC_QUERY',
                    privateToPublicFolder: 'PRIVATE_FOLDER_TO_PUBLIC_FOLDER',
                },
                public: {
                    readQueries: 'READ_PUBLIC_QUERIES',
                    readFolders: 'READ_PUBLIC_FOLDERS',
                    createQuery: 'CREATE_PUBLIC_QUERIES',
                    createFolder: 'CREATE_PUBLIC_FOLDERS',
                    deleteQuery: 'DELETE_PUBLIC_QUERIES',
                    deleteFolder: 'DELETE_PUBLIC_FOLDERS',
                    updateQuery: 'UPDATE_PUBLIC_QUERIES',
                    updateFolder: 'UPDATE_PUBLIC_FOLDERS',
                },
                runQuery: 'RUN_QUERY',
                // add: accessStore.checkPermission('ADD_USER_GROUP'),
                // remove: accessStore.checkPermission('REMOVE_USER_GROUP'),
                // create: accessStore.checkPermission('CREATE_GROUP'),
                // update: accessStore.checkPermission('UPDATE_GROUP'),
            }))

            /* --------PROVIDERS---- */
            provide('savedQueryGuidFromURL', savedQueryGuidFromURL)
            provide('savedQueryInfo', savedQueryInfo)
            provide('queryFolderNamespace', queryFolderNamespace)
            provide('permissions', permissions)
            /* --------------------- */
            console.log(savedQueryGuidFromURL.value)
            const fetchAndPassSavedQueryInfo = () => {
                const { data, error, isLoading } = InsightsAPI.GetSavedQuery(
                    savedQueryGuidFromURL.value as string
                )
                watch([data, error, isLoading], () => {
                    if (isLoading.value == false) {
                        isSavedQueryInfoLoaded.value = false
                        if (error.value === undefined) {
                            isSavedQueryInfoLoaded.value = false
                            savedQueryInfo.value = data.value.entity
                        } else {
                            message.error({
                                content: `Error in loading this query!`,
                            })
                        }
                    }
                })
            }
            const fetchQueryFolderNamespace = () => {
                const { data, error, isLoading } = getQueryFolderNamespace()
                watch([data, error, isLoading], () => {
                    if (isLoading.value == false) {
                        if (error.value === undefined) {
                            if (
                                data.value?.entities &&
                                data.value?.entities?.length > 0
                            ) {
                                queryFolderNamespace.value =
                                    data.value.entities[0]
                            }
                        } else {
                            message.error({
                                content: `Error in fetching root Info`,
                            })
                        }
                    }
                })
            }
            onMounted(() => {
                fetchQueryFolderNamespace()
                if (savedQueryGuidFromURL.value) fetchAndPassSavedQueryInfo()
            })
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
