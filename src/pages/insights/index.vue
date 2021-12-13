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
    import { useRoute, useRouter } from 'vue-router'
    import { message } from 'ant-design-vue'
    import {
        SavedQuery,
        QueryCollection,
    } from '~/types/insights/savedQuery.interface'
    import {
        AssetAttributes,
        SavedQueryAttributes,
        InternalAttributes,
    } from '~/constant/projection'
    import { useDiscoverList as useAssetData } from '~/composables/discovery/useDiscoverList'
    import useQueryCollection from '~/components/insights/explorers/queries/composables/useQueryCollection'
    export default defineComponent({
        name: 'Insights Page',
        components: { InsightsComponent },
        props: {},
        setup(props) {
            useHead({
                title: 'Insights',
            })
            const route = useRoute()
            const router = useRouter()
            const { getQueryCollections } = useQueryCollection()
            const savedQueryGuidFromURL = ref(route.query?.id)

            const isSavedQueryInfoLoaded = ref(true)
            const queryFolderNamespace: Ref<any> = ref()
            const queryCollectionsLoading = ref(true)
            const queryCollections: Ref<QueryCollection[] | undefined> = ref()
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

            const databaseQualifiedNameFromURL =
                route.query?.databaseQualifiedNameFromURL

            const schemaNameFromURL = route.query?.schemaNameFromURL
            const tableNameFromURL = route.query?.tableNameFromURL
            const columnNameFromURL = route.query?.columnNameFromURL

            /* --------PROVIDERS---- */
            provide(
                'databaseQualifiedNameFromURL',
                databaseQualifiedNameFromURL
            )
            provide('schemaNameFromURL', schemaNameFromURL)
            provide('tableNameFromURL', tableNameFromURL)
            provide('columnNameFromURL', columnNameFromURL)

            provide('savedQueryGuidFromURL', savedQueryGuidFromURL)
            provide('savedQueryInfo', savedQueryInfo)
            provide('queryFolderNamespace', queryFolderNamespace)
            provide('queryCollections', queryCollections)
            provide('queryCollectionsLoading', queryCollectionsLoading)
            provide('permissions', permissions)
            /* --------------------- */
            console.log(savedQueryGuidFromURL.value)

            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SavedQueryAttributes,
            ])

            const fetchAndPassSavedQueryInfo = () => {
                const facets = ref({
                    guid: savedQueryGuidFromURL.value,
                })
                const { list, error, isLoading } = useAssetData({
                    facets,
                    dependentKey: ref('insights_saved_query'),
                    relationAttributes: ref(['name']),
                    attributes: defaultAttributes,
                    limit: ref(1),
                })
                watch([list, error, isLoading], () => {
                    if (isLoading.value == false) {
                        isSavedQueryInfoLoaded.value = false
                        if (error.value === undefined) {
                            isSavedQueryInfoLoaded.value = false
                            // savedQueryInfo.value = data.value.entit
                            if (list.value && list.value?.length > 0) {
                                savedQueryInfo.value = list.value[0]
                            } else {
                                message.error({
                                    content: `Saved query not found`,
                                })
                                router.push('/insights')
                                savedQueryInfo.value = {}
                            }
                        } else {
                            message.error({
                                content: `Error in fetching this query!`,
                            })
                        }
                    }
                })
            }
            const fetchQueryCollections = () => {
                const { data, error, isLoading } = getQueryCollections()
                queryCollectionsLoading.value = true
                watch([data, error, isLoading], () => {
                    if (isLoading.value === false) {
                        queryCollectionsLoading.value = false
                        if (error.value === undefined) {
                            if (
                                data.value?.entities &&
                                data.value?.entities?.length > 0
                            ) {
                                // queryCollections.value = 'data.value.entities'
                                queryCollections.value = data.value.entities
                                console.log(
                                    'fetchQueryCollections',
                                    data.value.entities
                                )
                            }
                        } else {
                            message.error({
                                content: `Error fetching collections`,
                            })
                        }
                    }
                })
            }

            onMounted(() => {
                fetchQueryCollections()

                if (savedQueryGuidFromURL.value) {
                    fetchAndPassSavedQueryInfo()
                }
            })
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
