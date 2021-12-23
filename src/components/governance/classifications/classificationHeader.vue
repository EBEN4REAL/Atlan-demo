<template>
    <div class="flex flex-col px-5 bg-white pt-7">
        <div class="flex items-center justify-between gap-x-2">
            <div class="flex items-center">
                <ClassificationIcon
                    :color="selectedClassification?.options?.color"
                    class="h-6 mr-1"
                />
                <span class="text-xl truncate text-gray">{{
                    selectedClassification?.displayName
                }}</span>
            </div>
            <a-dropdown>
                <AtlanBtn
                    class="flex-none"
                    size="sm"
                    color="secondary"
                    padding="compact"
                    @click.prevent
                >
                    <AtlanIcon icon="KebabMenu" class="-mx-1 text-gray" />
                </AtlanBtn>

                <template #overlay>
                    <a-menu>
                        <a-menu-item
                            v-auth="map.UPDATE_CLASSIFICATION"
                            @click="editClassification"
                        >
                            <div class="flex items-center">
                                <AtlanIcon icon="Edit" />
                                <span class="pl-2 text-sm">Edit</span>
                            </div>
                        </a-menu-item>
                        <a-menu-item
                            v-auth="map.DELETE_CLASSIFICATION"
                            @click="deleteClassification"
                        >
                            <div class="flex items-center text-red-700">
                                <AtlanIcon icon="Trash" />
                                <span class="pl-2 text-sm">Delete</span>
                            </div>
                        </a-menu-item>
                        <a-sub-menu v-auth="map.UPDATE_CLASSIFICATION">
                            <template #title>
                                <span class="flex items-center">
                                    <ClassificationIcon
                                        class="self-center mr-1"
                                        :color="classificationColor"
                                    />
                                    <span class="self-center">Color</span>
                                </span>
                            </template>
                            <a-menu-item class="p-0 m-0 bg-white w-28">
                                <ClassificationColorSelector
                                    v-model:selectedColor="classificationColor"
                                    menuMode
                                />
                            </a-menu-item>
                        </a-sub-menu>
                    </a-menu>
                </template>
            </a-dropdown>
        </div>
        <AddClassificationModal
            v-model:modalVisible="isEditClassificationModalOpen"
            :classification="classification"
            mode="edit"
        />
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        computed,
        ref,
        PropType,
        toRefs,
        watch,
        h,
    } from 'vue'
    import { Modal } from 'ant-design-vue'
    import { whenever } from '@vueuse/core'
    import { useRouter } from 'vue-router'

    // import { useUserPreview } from '~/composables/user/showUserPreview'
    import Dropdown from '@/UI/dropdown.vue'
    import AddClassificationModal from '@/governance/classifications/addClassificationModal.vue'
    import AtlanBtn from '~/components/UI/button.vue'
    import ClassificationColorSelector from '@/governance/classifications/classificationColorSelector.vue'
    import ClassificationIcon from '@/governance/classifications/classificationIcon.vue'

    import useDeleteTypedefs from '~/composables/typedefs/useDeleteTypedefs'
    import { ClassificationInterface } from '~/types/classifications/classification.interface'

    import useEditTypedefs from '~/composables/typedefs/useEditTypedefs'
    import { useTypedefStore } from '~/store/typedef'
    import map from '~/constant/accessControl/map'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        name: 'ClassificationHeader',
        components: {
            Dropdown,
            AddClassificationModal,
            AtlanBtn,
            ClassificationColorSelector,
            ClassificationIcon,
        },
        props: {
            classification: {
                type: Object as PropType<ClassificationInterface>,
                required: true,
            },
        },
        setup(props) {
            const isDeleteClassificationModalOpen = ref(false)
            const isEditClassificationModalOpen = ref(false)
            const typedefStore = useTypedefStore()

            const { classification: selectedClassification } = toRefs(props)

            const classificationColor = ref(
                selectedClassification?.value?.options?.color ?? 'Blue'
            )

            const router = useRouter()

            const body = ref({})
            const { mutate: mutateEdit } = useEditTypedefs(body)

            const displayName = computed(
                () => selectedClassification.value.displayName
            )

            const deleteClassification = () => {
                Modal.confirm({
                    title: 'Delete Classification',
                    class: 'delete-classification-modal',
                    content: () => {
                        return h('div', [
                            'Are you sure you want to delete classification',
                            h('span', [' ']),
                            h(
                                'span',
                                {
                                    class: ['font-bold'],
                                },
                                [`${displayName.value}`]
                            ),
                            h('span', '?'),
                        ])
                    },
                    okType: 'danger',
                    autoFocusButton: null,
                    okButtonProps: {
                        type: 'primary',
                    },
                    okText: 'Delete',
                    cancelText: 'Cancel',
                    async onOk() {
                        const {
                            error: deleteError,
                            mutate: mutateDelete,
                            isReady: isDeleteReady,
                        } = useDeleteTypedefs(selectedClassification.value.name)

                        mutateDelete()
                        whenever(isDeleteReady, () => {
                            if (typedefStore.classificationList.length) {
                                const name =
                                    typedefStore.classificationList[0].name
                                router.push(
                                    `/governance/classifications/${name}`
                                )
                            } else {
                                router.push('/governance/classifications')
                            }
                            useAddEvent(
                                'governance',
                                'classification',
                                'deleted'
                            )
                        })
                    },
                })
            }
            const editClassification = () => {
                isEditClassificationModalOpen.value = true
            }
            const closeEditClassificationModal = () => {
                isEditClassificationModalOpen.value = false
            }
            const closeDeleteClassificationModal = () => {
                isDeleteClassificationModalOpen.value = false
            }

            watch(classificationColor, (newClassificationColor) => {
                body.value = {
                    classificationDefs: [
                        {
                            ...selectedClassification.value,
                            options: {
                                ...selectedClassification.value?.options,
                                color: newClassificationColor,
                            },
                        },
                    ],
                }
                mutateEdit()
            })

            // user preview drawer
            // const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
            // const handleClickUser = (username: string) => {
            //     setUserUniqueAttribute(username, 'username')
            //     showUserPreview({ allowed: ['about'] })
            // }
            return {
                isDeleteClassificationModalOpen,
                closeDeleteClassificationModal,
                closeEditClassificationModal,
                isEditClassificationModalOpen,
                deleteClassification,
                selectedClassification,
                displayName,
                editClassification,
                classificationColor,
                map,
            }
        },
    })
</script>
<style lang="less"></style>
