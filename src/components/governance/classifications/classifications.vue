<template>
    <ExplorerLayout
        title="Classification   "
        sub-title="Manage classification tags to build access policies."
    >
        <template #action>
            <AtlanBtn
                class="flex-none"
                size="sm"
                color="secondary"
                padding="compact"
                @click="createClassificationModalVisible = true"
            >
                <AtlanIcon icon="Add" class="-mx-1 text-gray"></AtlanIcon>
            </AtlanBtn>
        </template>
        <template #sidebar>
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
                        <AtlanIcon icon="Shield" class="text-pink-400" />
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
        <!-- <a-modal
            :visible="modalVisible"
            title="Add"
            @cancel="closeModal"
            :destroyOnClose="true"
            :footer="null"
        >
            <a-form
                ref="createClassificationFormRef"
                :model="formState"
                :rules="rules"
                layout="vertical"
            >
                <a-form-item ref="name" label="Name" name="name">
                    <a-input v-model:value="formState.name" />
                </a-form-item>
                <a-form-item
                    ref="description"
                    label="Description"
                    name="description"
                >
                    <a-textarea v-model:value="formState.description" />
                </a-form-item>

                <div class="flex justify-end w-full">
                    <a-button class="mr-4" @click="closeModal">Cancel</a-button>
                    <a-button
                        type="primary"
                        :loading="
                            createClassificationStatus === 'loading'
                                ? true
                                : false
                        "
                        @click="createClassification"
                        >Create</a-button
                    >
                </div>
            </a-form>
            <p v-if="createErrorText" class="mt-4 mb-0 text-sm text-red-500">
                {{ createErrorText }}
            </p>
        </a-modal> -->
    </ExplorerLayout>
    <!-- <NoAcces v-else /> -->
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
            const createClassificationModalVisible = ref(true)

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
                router.push(
                    `/governance/classifications/${encodeURIComponent(
                        newClassificationName as string
                    )}`
                )
            })

            return {
                classificationList,
                filteredClassificationList,
                searchQuery,
                selectedClassificationName,
                selectClassification,
                createClassificationModalVisible,
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
