<template>
    <div class="px-4 py-2 overflow-hidden overflow-y-auto tab-content-wrapper">
        <div v-if="isLoading" class="flex items-center justify-center h-full">
            <AtlanIcon icon="Loader" class="h-10 animate-spin" />
        </div>

        <div v-else class="h-full">
            <EditUser
                v-if="isEditing"
                :selected-user="selectedUser"
                :is-current-user="isCurrentUser"
                @toggle-edit="toggleEdit"
                @success="$emit('success')"
                @image-updated="handleImageUpdate"
                @updated-user="handleEdit"
            />
            <ViewUser
                v-else
                :selected-user="selectedUser"
                :is-current-user="isCurrentUser"
                :agg-data="aggData"
                @toggle-edit="toggleEdit"
                @success="$emit('success')"
                @changeTab="(tab) => $emit('changeTab', tab)"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineAsyncComponent,
        defineComponent,
        ref,
        toRefs,
        watch,
    } from 'vue'
    import { useBody } from 'src/composables/discovery/useBody'
    import bodybuilder from 'bodybuilder'
    import assetCategories from '~/constant/assetCategories'
    import useIndexSearch from '~/composables/discovery/useIndexSearch'

    export default defineComponent({
        name: 'UserPreviewAboutComponent',
        components: {
            EditUser: defineAsyncComponent(
                () => import('@/admin/users/userPreview/editUserDetails.vue')
            ),
            ViewUser: defineAsyncComponent(
                () => import('@/admin/users/userPreview/viewUserDetails.vue')
            ),
        },
        props: {
            selectedUser: {
                type: Object,
                default: () => {},
            },
            isCurrentUser: {
                type: Boolean,
                default: false,
            },
            isLoading: {
                type: Boolean,
                default: false,
            },
        },
        emits: ['updatedUser', 'success', 'imageUpdated', 'changeTab'],
        setup(props, { emit }) {
            const { selectedUser, isCurrentUser, isLoading } = toRefs(props)
            const isEditing = ref(false)
            const toggleEdit = () => {
                // emit('success')
                isEditing.value = !isEditing.value
            }
            const handleEdit = () => {
                emit('updatedUser')
                emit('success')
            }

            const handleImageUpdate = (updatedImageUrl) => {
                emit('imageUpdated', updatedImageUrl)
            }

            // Ownership Widget Data
            const aggData = ref({
                state: '',
                data: {},
            })
            assetCategories.forEach((category) => {
                aggData.value.data[category.id] = {
                    label: category.label,
                    id: category.id,
                    count: 0,
                }
            })

            const getAggregateOwnedEntities = () => {
                const base = bodybuilder()

                // base.orFilter('terms', '__superTypeNames.keyword', [
                //     'SQL',
                //     'BI',
                // ])
                // base.orFilter('terms', '__typeName.keyword', [
                //     'AtlasGlossaryTerm',
                // ])
                base.orFilter('terms', '__typeName.keyword', ['Asset'])
                base.filterMinimumShouldMatch(1)
                base.aggregation(
                    'terms',
                    '__typeName.keyword',
                    { size: 50 },
                    `group_by_typeName`
                )
                base.filter('term', '__state', 'ACTIVE')
                base.filter('terms', 'ownerUsers', [
                    selectedUser.value.username,
                ])

                const requestBody = base.build()
                const {
                    data,
                    error: aggError,
                    isLoading: aggLoading,
                } = useIndexSearch(
                    {
                        dsl: { from: 0, size: 0, ...requestBody },
                    },
                    ref('GET_OWNED_ASSETS_COUNT'),
                    false
                )
                return { data, aggLoading, aggError }
            }

            const populateAggregateData = () => {
                const { data, aggLoading, aggError } =
                    getAggregateOwnedEntities()

                watch([aggLoading, aggError], () => {
                    if (!aggError.value && !aggLoading.value) {
                        aggData.value.state = 'success'
                        if (
                            data?.value?.aggregations?.group_by_typeName
                                ?.buckets?.length
                        ) {
                            const { buckets } =
                                data.value.aggregations.group_by_typeName

                            if (buckets && buckets.length) {
                                buckets.forEach((bucket) => {
                                    const typeName = bucket.key.toLowerCase()
                                    const category = assetCategories.find(
                                        (cat) =>
                                            cat?.children?.find(
                                                (child) =>
                                                    (
                                                        child?.id ?? ''
                                                    ).toLowerCase() === typeName
                                            )
                                    )
                                    if (category)
                                        aggData.value.data[category.id].count +=
                                            bucket.doc_count
                                })
                            }

                            // const termBucket =
                            //     buckets.filter(
                            //         (bucket) =>
                            //             bucket.key === 'atlasglossaryterm'
                            //     )?.[0] ?? {}
                            // if (termBucket && termBucket.doc_count)
                            //     aggData.value.data.terms.count =
                            //         termBucket.doc_count
                            // const datasetBuckets = buckets.filter(
                            //     (bucket) => bucket.key !== 'atlasglossaryterm'
                            // )
                            // if (datasetBuckets && datasetBuckets.length) {
                            //     const datasetsCount = datasetBuckets.reduce(
                            //         (acc, curr) => acc + (curr?.doc_count ?? 0),
                            //         0
                            //     )
                            //     aggData.value.data.datasets.count =
                            //         datasetsCount ?? 0
                            // }
                        }
                    } else if (aggError.value && !aggLoading.value)
                        aggData.value.state = 'error'
                    else if (aggLoading.value) aggData.value.state = 'loading'
                    else aggData.value.state = ''
                })
            }
            populateAggregateData()

            return {
                selectedUser,
                isCurrentUser,
                isEditing,
                toggleEdit,
                handleImageUpdate,
                isLoading,
                aggData,
                handleEdit,
            }
        },
    })
</script>
<style lang="less" scoped>
    .tab-content-wrapper {
        height: calc(100vh - 5rem) !important;
    }
</style>
