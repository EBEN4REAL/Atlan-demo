<template>
    <ExplorerLayout
        v-if="false"
        title="Classification"
        sub-title="Manage classification tags to build access policies."
    >
        <template #action>
            <AtlanBtn
                v-auth="map.CREATE_CLASSIFICATION"
                class="flex-none"
                size="sm"
                color="secondary"
                padding="compact"
                @click="createClassificationModalVisible = true"
            >
                <AtlanIcon icon="Add" class="-mx-1 text-gray"></AtlanIcon>
            </AtlanBtn>
        </template>
        <template #sidebar
            v-auth="map.LIST_CLASSIFICATION"
        >
            <div class="flex px-3 py-1">
                <SearchAdvanced
                    v-model:value="searchQuery"
                    placeholder="Search classifications"
                    :autofocus="true"
                    class="mx-4 mt-6 mb-4 bg-white border-b-0"
                    size="minimal"
                />
            </div>
            <ExplorerList
                :list="filteredClassificationList"
                :selected="selectedClassificationName"
                dataKey="name"
                @select="selectClassification"
            >
                <template #default="{ item, isSelected }">
                    <div class="flex items-center gap-x-1">
                        <AtlanIcon icon="Shield"  :style="`color: ${getClassificationColorHex(item.options?.color)}`"/>
                        <span
                            class="text-sm truncate"
                            :class="
                                isSelected
                                    ? 'text-primary font-bold'
                                    : 'text-gray'
                            "
                        >
                            {{ item.displayName }}
                        </span>
                    </div>
                </template>
            </ExplorerList>
        </template>

        <router-view />
        <AddClassificationModal
            v-model:modalVisible="createClassificationModalVisible"
        />
    </ExplorerLayout>

    
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

    import useTypedefData from '~/composables/typedefs/useTypedefData'

    import { ClassificationInterface } from '~/types/classifications/classification.interface'
    import getClassificationColorHex from '@/governance/classifications/utils/getClassificationColor';
    import map from '~/constant/accessControl/map'

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
                if(newClassificationName !== router.currentRoute.value.params?.classificationId) {
                    router.push(
                        `/governance/classifications/${encodeURIComponent(
                            newClassificationName as string
                        )}`
                    )
                }
            })

            watch(router.currentRoute, (newRoute) => {
                if(newRoute.params?.classificationId !== selectedClassificationName.value) {
                    selectedClassificationName.value = newRoute.params.classificationId as string;
                }
            })

            return {
                classificationList,
                filteredClassificationList,
                searchQuery,
                selectedClassificationName,
                selectClassification,
                createClassificationModalVisible,
                getClassificationColorHex,
                map
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
