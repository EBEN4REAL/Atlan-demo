<template>
    <ExplorerLayout
        title="Classification"
        sub-title="Manage classification tags to build access policies."
    >
        <template #action>
            <AtlanBtn
                class="flex-none"
                size="sm"
                color="secondary"
                padding="compact"
                @click="toggleModal"
            >
                <AtlanIcon icon="Add" class="-mx-1 text-gray"></AtlanIcon>
            </AtlanBtn>
        </template>
        <template #sidebar>
            <SearchAndFilter
                placeholder="Search classifications"
                v-model:value="treeFilterText"
                @change="handleSearch"
                :autofocus="true"
                class="mx-4 mt-6 mb-4 bg-white"
            />
            <ExplorerList
                :list="filteredData"
                :selected="selectedClassificationNameFromRoute"
                @select="nodeEmit"
                dataKey="name"
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
                            {{ item.title }}
                        </span>
                    </div>
                </template>
            </ExplorerList>
        </template>

        <router-view />

        <a-modal
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
        </a-modal>
    </ExplorerLayout>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        reactive,
        ref,
        toRaw,
        UnwrapRef,
        watch,
        Ref,
        computed,
    } from 'vue'

    import { useRouter } from 'vue-router'
    import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface'
    import { useClassificationStore } from '~/components/admin/classifications/_store'

    import { Classification } from '~/api/atlas/classification'
    import { classificationInterface } from '~/types/classifications/classification.interface'
    import { typedefsInterface } from '~/types/typedefs/typedefs.interface'
    import AtlanBtn from '@/UI/button.vue'
    import ExplorerLayout from '@/admin/explorerLayout.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import ExplorerList from '@/admin/common/explorerList.vue'

    export default defineComponent({
        name: 'ClassificationProfile',
        props: {
            classificationName: {
                type: String as PropType<String>,
            },
        },
        components: { AtlanBtn, ExplorerLayout, SearchAndFilter, ExplorerList },
        setup(props) {
            const store = useClassificationStore()
            const router = useRouter()
            const modalVisible = ref(false)
            const createClassificationStatus = ref('')
            const treeFilterText = ref('')
            const createClassificationFormRef = ref()
            const classificationName = computed(() => props.classificationName)
            const createErrorText = ref('')
            interface FormState {
                name: string
                description: string
            }
            const treeData = computed(() => store.classificationTree)

            const selectedClassificationNameFromRoute = computed(
                () => store.selectedClassification
            )

            console.log(
                router?.currentRoute.value?.params?.classificationId,
                'route',
                router
            )

            const filteredData = computed(() =>
                treeFilterText.value
                    ? store.filteredClassificationTree
                    : treeData.value
            )

            // get classifications
            store.setClassificationsStatus('loading')
            const { data: classificationData, error: classificationError } =
                Classification.getClassificationList<typedefsInterface>({
                    cache: false,
                })

            watch([classificationData, classificationError], () => {
                if (classificationData.value) {
                    const classifications =
                        classificationData.value.classificationDefs || []
                    store.setClassifications(classifications ?? [])
                    store.initializeFilterTree()
                    store.setClassificationsStatus('success')
                    if (store.classificationTree.length > 0) {
                        if (
                            router?.currentRoute.value?.params?.classificationId
                        ) {
                            store.setSelectedClassification(
                                router?.currentRoute.value?.params
                                    ?.classificationId as string
                            )
                        } else {
                            router.push(
                                `/admin/classifications/${encodeURIComponent(
                                    store.classificationTree[0].name
                                )}`
                            )
                            store.setSelectedClassification(
                                store.classificationTree[0].name
                            )
                        }
                    }
                } else {
                    store.setClassificationsStatus('error')
                }
            })

            function nodeEmit(node: classificationInterface) {
                router.push(
                    `/admin/classifications/${encodeURIComponent(node.name)}`
                )
                store.setSelectedClassification(node.name)
            }

            const formState: UnwrapRef<FormState> = reactive({
                name: '',
                description: '',
            })

            const urlValidationRegex = new RegExp(
                '^[a-zA-Z][a-zA-Z0-9\s_]*',
                'g'
            )

            const rules = {
                name: [
                    {
                        required: true,

                        pattern: urlValidationRegex,
                        message:
                            'Names must consist of a letter followed by a sequence of letter, number, space, or _ characters',

                        trigger: 'blur',
                    },
                ],
            }

            const handleSearch = () => {
                store.filterClassificationTree(treeFilterText.value)
            }

            const closeModal = () => {
                modalVisible.value = false

                formState.name = ''
                formState.description = ''
            }
            const resetRef = (ref: Ref<string>, time: number) => {
                setTimeout(() => {
                    ref.value = ''
                }, time)
            }
            const createClassification = () => {
                const payload: {
                    classificationDefs: classificationInterface[]
                } = {
                    classificationDefs: [],
                }
                const classificationObj = {
                    attributeDefs: [],
                    description: '',
                    name: '',
                    superTypes: [],
                } as unknown as classificationInterface

                createClassificationFormRef.value
                    .validate()
                    .then(() => {
                        classificationObj.name = formState.name
                        classificationObj.description = formState.description
                        payload.classificationDefs.push(classificationObj)
                        // create classification
                        createClassificationStatus.value = 'loading'
                        const {
                            data: createClassificationData,
                            error: createClassificationError,
                        } = Classification.createClassification<typedefsInterface>(
                            {
                                cache: false,
                                payload,
                            }
                        )

                        watch(
                            [
                                createClassificationData,
                                createClassificationError,
                            ],
                            () => {
                                console.log(
                                    createClassificationData,
                                    createClassificationError
                                )

                                if (
                                    createClassificationData.value &&
                                    !createClassificationError.value
                                ) {
                                    console.log(
                                        'in errror',
                                        createClassificationData.value,
                                        createClassificationError.value
                                    )
                                    let classifications: classificationInterface[] =
                                        createClassificationData.value
                                            .classificationDefs
                                    classifications = [
                                        ...store.classifications,
                                        ...classifications,
                                    ]

                                    store.classifications =
                                        classifications ?? []
                                    const classificationTree =
                                        store.transformClassificationTreeData
                                    store.classificationTree =
                                        classificationTree ?? []
                                    createClassificationStatus.value = 'success'
                                    formState.name = ''
                                    formState.description = ''
                                    closeModal()
                                    // set this classification in view
                                    store.setSelectedClassification(
                                        classificationObj.name
                                    )
                                    router.push(
                                        `/admin/classifications/${encodeURIComponent(
                                            classificationObj.name
                                        )}`
                                    )
                                } else {
                                    createClassificationStatus.value = 'error'
                                    const error = toRaw(
                                        createClassificationError.value
                                    )
                                    console.log(
                                        'errormessage',
                                        error.response.data.errorMessage
                                    )
                                    createErrorText.value =
                                        error.response.data.errorMessage

                                    resetRef(createErrorText, 8000)
                                }
                            }
                        )
                    })
                    .catch((error: ValidateErrorEntity<FormState>) => {
                        //                        //                        console.log('error', error)
                    })
            }

            const toggleModal = () => {
                modalVisible.value = !modalVisible.value
            }

            const handleSelectNode = (node: classificationInterface) => {
                //                //                console.log(node, 'parent')
            }

            const classifications = computed(() => store.classifications)

            const selectedClassification: any = computed(() => {
                if (!props.classificationName) {
                    return {}
                }

                if (classifications.value.length === 0) {
                    return {}
                }
                return classifications.value.find(
                    (classification: classificationInterface) =>
                        (classification.name || '') ===
                        decodeURI(props.classificationName as string)
                )
            })
            const handleClickUser = () => {}

            return {
                selectedClassificationNameFromRoute,
                handleClickUser,
                createClassificationStatus,
                createErrorText,
                filteredData,
                treeData,
                handleSearch,
                treeFilterText,
                modalVisible,
                classificationName,
                selectedClassification,
                nodeEmit,
                closeModal,
                createClassification,
                toggleModal,
                createClassificationFormRef,
                other: '',
                formState,
                rules,
                handleSelectNode,
            }
        },
    })
</script>
<style lang="less" scoped>
    :global(.ant-form-item-label
            > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before) {
        @apply hidden;
    }
    // Aesterik in right side
    :global(.ant-form-item-label
            > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::after) {
        display: inline-block;
        margin-left: 4px;
        color: #ff4d4f;
        font-size: 14px;
        font-family: SimSun, sans-serif;
        line-height: 1;
        content: '*';
    }
</style>
<route lang="yaml">
meta:
layout: default
requiresAuth: true
</route>
