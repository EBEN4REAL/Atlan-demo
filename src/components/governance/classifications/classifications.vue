<template>
    <ExplorerLayout
        v-if="filteredClassificationList.length"
        title="Classification"
    >
        <template #action>
            <a-tooltip>
                <template #title>New Classification</template>
                <AtlanBtn
                    v-auth="map.CREATE_CLASSIFICATION"
                    class="flex-none px-2 ml-4"
                    size="sm"
                    color="secondary"
                    padding="compact"
                    @click="createClassificationModalVisible = true"
                >
                    <AtlanIcon icon="Add" /> </AtlanBtn
            ></a-tooltip>
        </template>
        <template #sidebar>
            <div v-auth="map.LIST_CLASSIFICATION" class="">
                <div class="flex items-center px-4">
                    <SearchAdvanced
                        v-model:value="searchQuery"
                        :placeholder="`Search from ${filteredClassificationList?.length} classification(s)`"
                        :autofocus="true"
                        size="minimal"
                        class="px-2 my-3"
                    />
                </div>
                <ExplorerList
                    :list="filteredClassificationList"
                    :selected="selectedClassificationName"
                    data-key="name"
                    @select="selectClassification"
                >
                    <template #default="{ item, isSelected }">
                        <div class="flex items-center justify-between gap-x-1">
                            <div class="flex items-center">
                                <ClassificationIcon
                                    :color="item.options?.color"
                                />
                                <span
                                    class="ml-2 text-sm truncate"
                                    :class="
                                        isSelected
                                            ? 'text-primary font-bold'
                                            : 'text-gray'
                                    "
                                >
                                    {{ item.displayName }}
                                </span>
                            </div>
                            <a-tooltip
                                v-if="item.description"
                                tabindex="-1"
                                :title="item.description"
                                placement="right"
                            >
                                <span
                                    ><AtlanIcon
                                        icon="Info"
                                        class="ml-1"
                                    ></AtlanIcon
                                ></span>
                            </a-tooltip>
                        </div>
                    </template>
                </ExplorerList>
            </div>
        </template>

        <router-view />
    </ExplorerLayout>
    <div v-else class="flex items-center justify-center h-full">
        <a-empty
            :image-style="{
                height: '0px',
            }"
        >
            <template #description>
                <AtlanIcon icon="EmptyClassifications" class="h-32 mb-6" />
                <p class="mb-8 text-2xl font-bold">
                    Create a new classifiaction!
                </p>
                <a-button
                    v-auth="map.CREATE_CLASSIFICATION"
                    type="primary"
                    @click="createClassificationModalVisible = true"
                >
                    <AtlanIcon icon="Add" class="inline" />
                    Add classification
                </a-button>
            </template>
        </a-empty>
    </div>
    <AddClassificationModal
        v-model:modalVisible="createClassificationModalVisible"
    />
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        computed,
        ref,
        watch,
        onMounted,
    } from 'vue'
    import { useRouter } from 'vue-router'

    import AtlanBtn from '@/UI/button.vue'
    import ExplorerLayout from '@/admin/explorerLayout.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import ExplorerList from '@/admin/common/explorerList.vue'
    import NoAcces from '@/common/secured/access.vue'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import AddClassificationModal from '@/governance/classifications/addClassificationModal.vue'
    import ClassificationIcon from '@/governance/classifications/classificationIcon.vue'

    import useTypedefData from '~/composables/typedefs/useTypedefData'

    import { ClassificationInterface } from '~/types/classifications/classification.interface'

    import map from '~/constant/accessControl/map'
    import EmptyClassifications from '~/assets/images/icons/empty-classifications.svg'

    export default defineComponent({
        name: 'ClassificationProfileWrapper',
        props: {
            classificationName: {
                type: String as PropType<String>,
            },
        },
        components: {
            AtlanBtn,
            ExplorerLayout,
            SearchAndFilter,
            ExplorerList,
            NoAcces,
            SearchAdvanced,
            AddClassificationModal,
            ClassificationIcon,
        },
        setup(props) {
            const router = useRouter()

            const { classificationList } = useTypedefData()
            const searchQuery = ref('')
            const selectedClassificationName = ref('')
            const createClassificationModalVisible = ref(false)

            const filteredClassificationList = computed(() => {
                if (searchQuery.value) {
                    return classificationList.value.filter((classification) =>
                        classification.displayName
                            .toLowerCase()
                            .includes(searchQuery.value)
                    )
                }
                return classificationList.value
            })

            const selectClassification = (item: ClassificationInterface) => {
                selectedClassificationName.value = item.name
            }

            onMounted(() => {
                selectedClassificationName.value =
                    (router.currentRoute.value.params
                        ?.classificationId as string) ??
                    classificationList.value[0]?.name ??
                    ''
            })

            watch(selectedClassificationName, (newClassificationName) => {
                if (
                    newClassificationName !==
                    router.currentRoute.value.params?.classificationId
                ) {
                    router.push(
                        `/governance/classifications/${encodeURIComponent(
                            newClassificationName as string
                        )}`
                    )
                }
            })

            watch(router.currentRoute, (newRoute) => {
                if (
                    newRoute.params?.classificationId !==
                    selectedClassificationName.value
                ) {
                    selectedClassificationName.value = newRoute.params
                        .classificationId as string
                }
            })

            return {
                classificationList,
                filteredClassificationList,
                searchQuery,
                selectedClassificationName,
                selectClassification,
                createClassificationModalVisible,
                map,
                EmptyClassifications,
            }
        },
    })
</script>
<style lang="less" scoped></style>
<route lang="yaml">
meta:
layout: default
requiresAuth: true
</route>
